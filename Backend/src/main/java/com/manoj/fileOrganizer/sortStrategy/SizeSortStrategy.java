// SizeSortStrategy.java
package com.manoj.fileOrganizer.sortStrategy;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;

public class SizeSortStrategy implements SortStrategy {
    private final boolean descending;

    public SizeSortStrategy(boolean descending) {
        this.descending = descending;
    }

    @Override
    public List<Path> sort(List<Path> files) {
        return files.stream()
                .sorted((a, b) -> {
                    long sizeA = getSafeSize(a);
                    long sizeB = getSafeSize(b);
                    return descending ? Long.compare(sizeB, sizeA) : Long.compare(sizeA, sizeB);
                })
                .toList();
    }

    private static long getSafeSize(Path path) {
        try {
            return Files.size(path);
        } catch (IOException e) {
            return Long.MAX_VALUE;
        }
    }
}
