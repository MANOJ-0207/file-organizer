// NoOpSortStrategy.java
package com.manoj.fileOrganizer.sortStrategy;

import java.nio.file.Path;
import java.util.List;

public class NoOpSortStrategy implements SortStrategy {
    @Override
    public List<Path> sort(List<Path> files) {
        return files;
    }
}
