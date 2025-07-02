// SortStrategy.java
package com.manoj.fileOrganizer.sortStrategy;

import java.nio.file.Path;
import java.util.List;

public interface SortStrategy {
    List<Path> sort(List<Path> files);
}
