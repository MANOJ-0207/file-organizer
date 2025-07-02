package com.manoj.fileOrganizer.model;

import java.util.List;

public class FilterSettings {
    private boolean advancedNameFilter;
    private String namePattern;
    private TimeFilterSettings timeFilter;
    private List<String> fileTypes;

    public boolean isAdvancedNameFilter() {
        return advancedNameFilter;
    }

    public String getNamePattern() {
        return namePattern;
    }

    public TimeFilterSettings getTimeFilter() {
        return timeFilter;
    }

    public List<String> getFileTypes() {
        return fileTypes;
    }
}
