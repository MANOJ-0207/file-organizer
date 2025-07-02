package com.manoj.fileOrganizer.model;

public class SortSettings {

    private boolean enabled;

    private String sortOrder; // "asc" or "dsc"
    private String type;  // "size", "modified"


    public boolean isEnabled() {
        return enabled;
    }

    public String getType() {
        return type;
    }

    public String getSortOrder() {
        return sortOrder;
    }

    public boolean isDescending() {
//        System.out.println("Settings Check :" + sortOrder);
        return "dsc".equalsIgnoreCase(sortOrder);
    }
}
