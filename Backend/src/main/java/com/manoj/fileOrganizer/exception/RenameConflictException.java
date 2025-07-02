package com.manoj.fileOrganizer.exception;

import java.nio.file.Path;
import java.util.List;

public class RenameConflictException extends RuntimeException {
    private final List<Path> conflictingFiles;

    public RenameConflictException(String message, List<Path> conflicts) {
        super(message);
        this.conflictingFiles = conflicts;
    }

    public List<Path> getConflictingFiles() {
        return conflictingFiles;
    }
}
