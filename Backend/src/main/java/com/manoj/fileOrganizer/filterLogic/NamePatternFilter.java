package com.manoj.fileOrganizer.filterLogic;

import com.manoj.fileOrganizer.model.FilterSettings;
import com.manoj.fileOrganizer.util.PatternMatcher;

import java.nio.file.Path;

public class NamePatternFilter implements FileFilter {

    private final boolean enabled;
    private final String pattern;

    public NamePatternFilter(FilterSettings filters) {
        this.enabled = filters.isAdvancedNameFilter();
        this.pattern = filters.getNamePattern(); // pass raw user pattern
    }

    @Override
    public boolean valid(Path path) {
        if (!enabled)
            return true;
        String filename = path.getFileName().toString();
        return PatternMatcher.matches(pattern, filename);
    }
}
