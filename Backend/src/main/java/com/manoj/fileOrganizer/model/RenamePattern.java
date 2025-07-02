package com.manoj.fileOrganizer.model;

public class RenamePattern {
    private String prefix;
    private String suffix;
    private boolean includeDatePrefix;
    private boolean includeDateSuffix;
    private String prefixFormat;
    private String suffixFormat;
    private String timeType; // "created" or "modified"

    public String getPrefix() {
        return prefix;
    }

    public String getSuffix() {
        return suffix;
    }

    public boolean isIncludeDatePrefix() {
        return includeDatePrefix;
    }

    public boolean isIncludeDateSuffix() {
        return includeDateSuffix;
    }

    public String getPrefixFormat() {
        return prefixFormat;
    }

    public String getSuffixFormat() {
        return suffixFormat;
    }

    public String getTimeType() {
        return timeType;
    }
}