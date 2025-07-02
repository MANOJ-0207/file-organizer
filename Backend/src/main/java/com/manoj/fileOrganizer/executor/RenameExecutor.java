package com.manoj.fileOrganizer.executor;
import java.io.IOException;


import java.nio.file.FileSystemException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;

public class RenameExecutor {

    public static void execute(Map<Path, Path> renameMap) throws IOException {
        for (Map.Entry<Path, Path> entry : renameMap.entrySet()) {
            Path source = entry.getKey();
            Path target = entry.getValue();

            Files.createDirectories(target.getParent());

            try {
                Files.move(source, target, StandardCopyOption.REPLACE_EXISTING);
            } catch (FileSystemException e) {
                // Let it bubble up to global handler
                throw e;
            } catch (IOException e) {
                throw new RuntimeException("Failed to move " + source + " to " + target + ": " + e.getMessage(), e);
            }
        }
    }

    public static void reverseExecute(Map<Path, Path> renameMap) throws IOException {
        for (Map.Entry<Path, Path> entry : renameMap.entrySet()) {
            Path original = entry.getKey();
            Path renamed = entry.getValue();

            try {
                Files.move(renamed, original, StandardCopyOption.REPLACE_EXISTING);
            } catch (FileSystemException e) {
                throw e;
            } catch (IOException e) {
                throw new RuntimeException("Failed to revert " + renamed + " to " + original + ": " + e.getMessage(), e);
            }
        }
    }
}
