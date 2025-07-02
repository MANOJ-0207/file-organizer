package com.manoj.fileOrganizer.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.TextStyle;
import java.util.Locale;

public class DateFormatter {

    public static String formatCustom(Path file, String timeType, String format) {
        try {
            BasicFileAttributes attrs = Files.readAttributes(file, BasicFileAttributes.class);
            Instant timestamp = "created".equalsIgnoreCase(timeType)
                    ? attrs.creationTime().toInstant()
                    : attrs.lastModifiedTime().toInstant();

            LocalDateTime dt = LocalDateTime.ofInstant(timestamp, ZoneId.systemDefault());
            return applyFormat(dt, format);
        } catch (IOException e) {
            return "invalid-date";
        }
    }

    private static String applyFormat(LocalDateTime dt, String format) {
        StringBuilder result = new StringBuilder();
        String[] tokens = format.split("(?=[^a-zA-Z])|(?<=[^a-zA-Z])"); // separate by non-letter boundaries

        for (String token : tokens) {
            switch (token) {
                case "hh" -> result.append(String.format("%02d", dt.getHour()));
                case "mm" -> result.append(String.format("%02d", dt.getMinute()));
                case "ss" -> result.append(String.format("%02d", dt.getSecond()));
                case "dd" -> result.append(String.format("%02d", dt.getDayOfMonth()));
                case "MM" -> result.append(String.format("%02d", dt.getMonthValue()));
                case "mon" -> result.append(dt.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
                case "month" -> result.append(dt.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH));
                case "day" -> result.append(dt.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
                case "DAY" -> result.append(dt.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH));
                case "yy" -> result.append(String.format("%02d", dt.getYear() % 100));
                case "yyyy" -> result.append(dt.getYear());
                default -> result.append(token); // punctuation, spaces, etc.
            }
        }

        return result.toString();
    }
}
