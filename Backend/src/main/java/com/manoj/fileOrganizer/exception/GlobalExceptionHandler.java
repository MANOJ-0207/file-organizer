package com.manoj.fileOrganizer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.nio.file.FileSystemException;
import java.nio.file.Path;
import java.util.*;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException ex) {
        return buildJsonResponse("Invalid Input", ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(NoSuchElementException ex) {
        return buildJsonResponse("Not Found", ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex) {
        return buildJsonResponse("Illegal State", ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        return buildJsonResponse("Access Denied", ex.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(FileSystemException.class)
    public ResponseEntity<Map<String, Object>> handleFileSystemException(FileSystemException ex) {
        return buildJsonResponse(
                "File Access Error",
                "One or more files are open or being used by another application. Please close them and try again.\nFile: " + ex.getFile(),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(RenameConflictException.class)
    public ResponseEntity<Map<String, Object>> handleRenameConflict(RenameConflictException ex) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", "File Name Conflict");
        body.put("message", ex.getMessage());
        body.put("conflicts", ex.getConflictingFiles().stream().map(Path::toString).toList());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnknownException(Exception ex) {
        ex.printStackTrace(); // for logging/debugging
        return buildJsonResponse(
                "Server Error",
                "An unexpected error occurred. " + ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    // Helper
    private ResponseEntity<Map<String, Object>> buildJsonResponse(String error, String message, HttpStatus status) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", error);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
