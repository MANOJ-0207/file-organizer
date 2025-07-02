// CreatedDateSortStrategy.java
package com.manoj.fileOrganizer.sortStrategy;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Comparator;
import java.util.List;

public class CreatedDateSortStrategy implements SortStrategy {
    private final boolean descending;

    public CreatedDateSortStrategy(boolean descending) {
        this.descending = descending;
    }

    @Override
    public List<Path> sort(List<Path> files) {
        return files.stream()
                .sorted((a, b) -> {
                    long timeA = getCreatedTime(a);
                    long timeB = getCreatedTime(b);
                    return descending ? Long.compare(timeB, timeA) : Long.compare(timeA, timeB);
                })
                .toList();
    }

    private static long getCreatedTime(Path path) {
        try {
            return Files.readAttributes(path, BasicFileAttributes.class).creationTime().toMillis();
        } catch (IOException e) {
            return Long.MAX_VALUE;
        }
    }
}
