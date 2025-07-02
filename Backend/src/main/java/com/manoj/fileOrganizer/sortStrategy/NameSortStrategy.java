// NameSortStrategy.java
package com.manoj.fileOrganizer.sortStrategy;

import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;

public class NameSortStrategy implements SortStrategy {
    private final boolean descending;

    public NameSortStrategy(boolean descending) {
        this.descending = descending;
    }

    @Override
    public List<Path> sort(List<Path> files) {
        return files.stream()
                .sorted((a, b) -> {
                    String nameA = a.getFileName().toString().toLowerCase();
                    String nameB = b.getFileName().toString().toLowerCase();
                    return descending ? nameB.compareTo(nameA) : nameA.compareTo(nameB);
                })
                .toList();
    }
}
