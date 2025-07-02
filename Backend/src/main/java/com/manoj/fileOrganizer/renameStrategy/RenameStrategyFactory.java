package com.manoj.fileOrganizer.renameStrategy;

public class RenameStrategyFactory {

    public static RenameStrategy getStrategy(String mode) {
        return switch (mode.toLowerCase())
        {
            case "rename" -> new CompleteRenameStrategy();
            case "replace" -> new ReplaceRenameStrategy();
            case "none" -> new NoOpsRenameStrategy();
            default -> throw new IllegalArgumentException("Invalid rename mode: " + mode);
        };
    }
}
