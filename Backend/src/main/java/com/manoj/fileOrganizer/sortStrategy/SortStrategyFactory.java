package com.manoj.fileOrganizer.sortStrategy;

import com.manoj.fileOrganizer.model.SortSettings;

public class SortStrategyFactory {
    public static SortStrategy getStrategy(SortSettings settings) {
        if (!settings.isEnabled()) {
            return new NoOpSortStrategy();
        }
//        System.out.println("Descending : " + settings.isDescending());
        return switch (settings.getType().toLowerCase()) {
            case "size"     -> new SizeSortStrategy(settings.isDescending());
            case "modified" -> new ModifiedDateSortStrategy(settings.isDescending());
            case "created"  -> new CreatedDateSortStrategy(settings.isDescending());
            case "name"     -> new NameSortStrategy(settings.isDescending());
            default         -> new NoOpSortStrategy();
        };
    }
}
