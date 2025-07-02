package com.manoj.fileOrganizer.executor;

import com.manoj.fileOrganizer.exception.FileScanningException;
import com.manoj.fileOrganizer.filterLogic.FileFilter;
import com.manoj.fileOrganizer.filterLogic.NamePatternFilter;
import com.manoj.fileOrganizer.filterLogic.TimeFilter;
import com.manoj.fileOrganizer.filterLogic.TypeFilter;
import com.manoj.fileOrganizer.model.FileOrganizeRequest;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class FileFilterEngine {

    public static List<Path> filter(FileOrganizeRequest request) {
        Path homeDir = Paths.get(request.getHomeDir());

        if (!Files.exists(homeDir) || !Files.isDirectory(homeDir)) {
            throw new IllegalArgumentException("Invalid home directory: " + homeDir);
        }

        List<Path> initialFiles;
        try {
            initialFiles = Files.list(homeDir)
                    .filter(Files::isRegularFile)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new FileScanningException("Failed to scan files in directory: " + homeDir, e);
        }
        List<FileFilter> filters = new ArrayList<>();
        filters.add(new TimeFilter(request, request.getFilters().getTimeFilter().getTimeType()));
        filters.add(new TypeFilter(request.getFilters()));
        filters.add(new NamePatternFilter(request.getFilters()));

        List<Path> filteredFiles = new ArrayList<>(initialFiles);
        for (FileFilter fileFilter : filters) {
            filteredFiles = filteredFiles.stream()
                    .filter(fileFilter::valid)
                    .collect(Collectors.toList());
        }

        return filteredFiles;
    }
}
