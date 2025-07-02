package com.manoj.fileOrganizer.model;

public class TimeFilterSettings {
    private boolean enabled;
    private String timeType; // created or modified
    private String start; // use ISO 8601 string (e.g., "2024-06-26T14:00")
    private String end;

    public boolean isEnabled() {
        return enabled;
    }

    public String getStart() {
        return start;
    }

    public String getEnd() {
        return end;
    }

    public String getTimeType() {
        return timeType;
    }
}