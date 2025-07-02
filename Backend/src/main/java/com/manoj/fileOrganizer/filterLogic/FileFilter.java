package com.manoj.fileOrganizer.filterLogic;

import java.nio.file.Path;

public interface FileFilter {
    boolean valid(Path path);
}
