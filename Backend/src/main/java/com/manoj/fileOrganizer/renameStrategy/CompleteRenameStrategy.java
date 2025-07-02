package com.manoj.fileOrganizer.renameStrategy;

import com.manoj.fileOrganizer.model.RenamePattern;
import com.manoj.fileOrganizer.model.RenameSettings;
import com.manoj.fileOrganizer.util.DateFormatter;

import java.nio.file.Path;

public class CompleteRenameStrategy implements RenameStrategy {

    @Override
    public String computeNewName(Path file, RenameSettings settings, int id) {
        RenamePattern pattern = settings.getRenamePattern();
        String timeType = pattern.getTimeType();

        String prefix = pattern.getPrefix() != null ? pattern.getPrefix() : "";
        String suffix = pattern.getSuffix() != null ? pattern.getSuffix() : "";

        if (pattern.isIncludeDatePrefix()) {
            String formattedDate = DateFormatter.formatCustom(file, timeType, pattern.getPrefixFormat());
            prefix = prefix.replace("${date_time}", formattedDate);
        }

        if (pattern.isIncludeDateSuffix()) {
            String formattedDate = DateFormatter.formatCustom(file, timeType, pattern.getSuffixFormat());
            suffix = suffix.replace("${date_time}", formattedDate);
        }

        String idStr = String.valueOf(id);
        String ext = getExtension(file.getFileName().toString());

        return prefix + idStr + suffix + "." + ext;
    }

    private String getExtension(String name) {
        int idx = name.lastIndexOf('.');
        return idx >= 0 ? name.substring(idx + 1) : "";
    }
}
