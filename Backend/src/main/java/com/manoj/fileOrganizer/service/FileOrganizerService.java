package com.manoj.fileOrganizer.service;

import com.manoj.fileOrganizer.executor.FileFilterEngine;
import com.manoj.fileOrganizer.executor.RenameExecutor;
import com.manoj.fileOrganizer.model.FileOrganizeRequest;
import com.manoj.fileOrganizer.model.RenameSettings;
import com.manoj.fileOrganizer.renameStrategy.RenameStrategy;
import com.manoj.fileOrganizer.renameStrategy.RenameStrategyFactory;
import com.manoj.fileOrganizer.exception.RenameConflictException;
import com.manoj.fileOrganizer.sortStrategy.SortStrategy;
import com.manoj.fileOrganizer.sortStrategy.SortStrategyFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@Service
public class FileOrganizerService {

    private Map<Path, Path> lastRenamePlan = null;
    private RenameSettings lastRenameSettings = null;

    public void filterAndOrganize(FileOrganizeRequest request) throws IOException {
        List<Path> files = FileFilterEngine.filter(request);

        // Apply sorting
        if("rename".equalsIgnoreCase(request.getRename().getMode()))
        {
            SortStrategy sortStrategy = SortStrategyFactory.getStrategy(request.getSort());
            files = sortStrategy.sort(files);
        }

        RenameStrategy strategy = RenameStrategyFactory.getStrategy(request.getRename().getMode());
        Map<Path, Path> renamePlan = new LinkedHashMap<>();
        int id = request.getRename().getStartId();

        List<Path> conflicts = new ArrayList<>();

        for (Path file : files) {
            String oldName = file.getFileName().toString();
            String newName = strategy.computeNewName(file, request.getRename(), id++);

            Path targetDir = file.getParent();
            boolean moveToSubfolder = request.getRename().isMoveToSubfolder();
            if (moveToSubfolder) {
                targetDir = targetDir.resolve(request.getRename().getSubfolderName());
            }

            Path targetPath = targetDir.resolve(newName);

            // Skip if name and path are the same (no-op)
            if (!moveToSubfolder && newName.equals(oldName)) {
                continue;
            }

            // Conflict check (except when file is being moved into subfolder but has same name)
            if (Files.exists(targetPath) && !file.equals(targetPath)) {
                conflicts.add(targetPath);
                continue;
            }

            renamePlan.put(file, targetPath);
        }

        if (!conflicts.isEmpty()) {
            throw new RenameConflictException("Some target files already exist", conflicts);
        }

        // Perform renaming
        RenameExecutor.execute(renamePlan);
        lastRenamePlan = renamePlan;
        lastRenameSettings = request.getRename();
    }
    public void undoLastRename() throws IOException {
        if (lastRenamePlan == null || lastRenameSettings == null) {
            throw new IllegalStateException("No rename operation to undo");
        }
        RenameExecutor.reverseExecute(lastRenamePlan);
        clearUndoState(); // Clear undo state after revert
    }

    public void commitChanges() {
        clearUndoState(); // Once committed, make irreversible
    }

    private void clearUndoState() {
        lastRenamePlan = null;
        lastRenameSettings = null;
    }
}
