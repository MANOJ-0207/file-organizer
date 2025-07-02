package com.manoj.fileOrganizer.exception;

public class RenameOperationException extends RuntimeException {
    public RenameOperationException(String message) {
        super(message);
    }

    public RenameOperationException(String message, Throwable cause) {
        super(message, cause);
    }
}
