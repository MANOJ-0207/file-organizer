package com.manoj.fileOrganizer.renameStrategy;

import com.manoj.fileOrganizer.model.RenameSettings;

import java.nio.file.Path;

public interface RenameStrategy {
    String computeNewName(Path file, RenameSettings settings, int id);
}
