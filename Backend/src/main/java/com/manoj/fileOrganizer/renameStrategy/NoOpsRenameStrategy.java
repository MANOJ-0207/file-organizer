package com.manoj.fileOrganizer.renameStrategy;

import com.manoj.fileOrganizer.model.RenameSettings;

import java.nio.file.Path;

public class NoOpsRenameStrategy implements RenameStrategy
{
    @Override
    public String computeNewName(Path file, RenameSettings settings, int id) {
        return file.getFileName().toString();
    }
}
