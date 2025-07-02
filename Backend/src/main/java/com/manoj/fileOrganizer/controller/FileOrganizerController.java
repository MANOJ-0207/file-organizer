package com.manoj.fileOrganizer.controller;

import com.manoj.fileOrganizer.model.FileOrganizeRequest;
import com.manoj.fileOrganizer.service.FileOrganizerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@CrossOrigin
public class FileOrganizerController {

    @Autowired
    private FileOrganizerService fileOrganizerService;

    @PostMapping("/filterAndOrganize")
    public ResponseEntity<Map<String, Object>> organize(@RequestBody FileOrganizeRequest request) throws IOException {
        fileOrganizerService.filterAndOrganize(request);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Files organized successfully"
        ));
    }

    @PostMapping("/undo")
    public ResponseEntity<Map<String, Object>> undo() throws IOException {
        fileOrganizerService.undoLastRename();
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Undo successful"
        ));
    }

    @PostMapping("/commit")
    public ResponseEntity<Map<String, Object>> commit() {
        fileOrganizerService.commitChanges();
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Changes committed"
        ));
    }

    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> check() {
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Hello"
        ));
    }
}
