package com.manoj.fileOrganizer.renameStrategy;

import com.manoj.fileOrganizer.model.RenameSettings;

import java.nio.file.Path;

public class ReplaceRenameStrategy implements RenameStrategy {

    @Override
    public String computeNewName(Path file, RenameSettings settings, int id) {
        String name = file.getFileName().toString();
        String from = settings.getReplacePattern().getFind();
        String to = settings.getReplacePattern().getReplace();

        if (from == null || from.isEmpty())
            return name;
        return name.replace(from, to == null ? "" : to);
    }

}
