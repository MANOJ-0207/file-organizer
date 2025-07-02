package com.manoj.fileOrganizer.model;

public class RenameSettings {
    private String mode; // "rename" or "replace" or "none"
    private int startId;
    private boolean moveToSubfolder;
    private String subfolderName;
    private RenamePattern renamePattern;
    private ReplacePattern replacePattern;

    public String getMode() {
        return mode;
    }

    public int getStartId() {
        return startId;
    }

    public boolean isMoveToSubfolder() {
        return moveToSubfolder;
    }

    public String getSubfolderName() {
        return subfolderName;
    }

    public RenamePattern getRenamePattern() {
        return renamePattern;
    }

    public ReplacePattern getReplacePattern() {
        return replacePattern;
    }
}