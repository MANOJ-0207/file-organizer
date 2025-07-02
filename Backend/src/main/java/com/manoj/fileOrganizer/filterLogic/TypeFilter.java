package com.manoj.fileOrganizer.filterLogic;

import com.manoj.fileOrganizer.model.FilterSettings;

import java.nio.file.Path;
import java.util.HashSet;
import java.util.List;

public class TypeFilter implements FileFilter {

    private final HashSet<String> allowedTypes;

    public TypeFilter(FilterSettings filters) {
        List<String> types = filters.getFileTypes();
        this.allowedTypes = (types != null) ? new HashSet<>(types) : null;
    }

    @Override
    public boolean valid(Path path) {
        if (allowedTypes == null || allowedTypes.isEmpty())
            return true;
        String name = path.getFileName().toString();
        int idx = name.lastIndexOf('.');
        String ext = idx >= 0 ? name.substring(idx).toLowerCase() : "";
        return allowedTypes.contains(ext);
    }
}
