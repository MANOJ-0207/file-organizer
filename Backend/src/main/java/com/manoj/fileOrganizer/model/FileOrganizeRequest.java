package com.manoj.fileOrganizer.model;

public class FileOrganizeRequest {
    private String homeDir;
    private FilterSettings filters;
    private SortSettings sort;
    private RenameSettings rename;

    public String getHomeDir() {
        return homeDir;
    }

    public FilterSettings getFilters() {
        return filters;
    }

    public SortSettings getSort() {
        return sort;
    }

    public RenameSettings getRename() {
        return rename;
    }
}
