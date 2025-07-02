package com.manoj.fileOrganizer.filterLogic;

import com.manoj.fileOrganizer.model.FileOrganizeRequest;
import com.manoj.fileOrganizer.model.TimeFilterSettings;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class TimeFilter implements FileFilter {

    private final boolean enabled;

    private final String timeType;
    private final Instant start;
    private final Instant end;

    public TimeFilter(FileOrganizeRequest request, String timeType) {

        TimeFilterSettings timeSettings = request.getFilters().getTimeFilter();
        this.enabled = timeSettings.isEnabled();
        this.timeType = timeType;
        this.start = enabled ? parseInstantSafe(timeSettings.getStart()) : null;
        this.end = enabled ? parseInstantSafe(timeSettings.getEnd()) : null;
    }

    private Instant parseInstantSafe(String time) {
        try {
            return LocalDateTime.parse(time).atZone(ZoneId.systemDefault()).toInstant();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public boolean valid(Path path) {
        if (!enabled || start == null || end == null)
            return true;

        try {
            BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);
            Instant fileTime = "created".equals(timeType) ? attrs.creationTime().toInstant() : attrs.lastModifiedTime().toInstant();
            return !fileTime.isBefore(start) && !fileTime.isAfter(end);
        } catch (IOException e) {
            return false; // failed to read file time
        }
    }
}
