// ModifiedDateSortStrategy.java
package com.manoj.fileOrganizer.sortStrategy;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;

public class ModifiedDateSortStrategy implements SortStrategy {
    private final boolean descending;

    public ModifiedDateSortStrategy(boolean descending) {
        this.descending = descending;
    }

    @Override
    public List<Path> sort(List<Path> files) {
        return files.stream()
                .sorted((a, b) -> {
                    long timeA = getModifiedTime(a);
                    long timeB = getModifiedTime(b);
                    return descending ? Long.compare(timeB, timeA) : Long.compare(timeA, timeB);
                })
                .toList();
    }

    private static long getModifiedTime(Path path) {
        try {
            return Files.getLastModifiedTime(path).toMillis();
        } catch (IOException e) {
            return Long.MAX_VALUE;
        }
    }
}
