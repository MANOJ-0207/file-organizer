package com.manoj.fileOrganizer.util;

public class PatternMatcher {

    /**
     * Matches the given text with a SQL-like pattern:
     * - `_` matches exactly one character
     * - `%` matches any sequence of characters (including empty)
     * Matching is case-insensitive.
     */
    public static boolean matches(String pattern, String text)
    {
        if (pattern == null || text == null)
            return false;
        return matchHelper(pattern.toLowerCase(), 0, text.toLowerCase(), 0);
    }

    private static boolean matchHelper(String pattern, int pi, String text, int ti) {
        int pLen = pattern.length();
        int tLen = text.length();

        while (pi < pLen && ti < tLen)
        {
            char pChar = pattern.charAt(pi);
            char tChar = text.charAt(ti);

            if (pChar == '_')
            {
                pi++;
                ti++;
            }
            else if (pChar == '%')
            {
                while (pi + 1 < pLen && pattern.charAt(pi + 1) == '%') pi++; // skip redundant %
                if (pi + 1 == pLen)
                    return true; // trailing % matches all
                pi++;
                while (ti <= tLen)
                {
                    if (matchHelper(pattern, pi, text, ti)) return true;
                    ti++;
                }
                return false;
            }
            else
            {
                if (pChar != tChar) return false;
                pi++;
                ti++;
            }
        }

        // Remaining pattern should only be %
        while (pi < pLen && pattern.charAt(pi) == '%')
            pi++;

        return pi == pLen && ti == tLen;
    }
}
