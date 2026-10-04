package com.jangombe.jangombe_backend.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

public final class AcademicTerm {

    private AcademicTerm() {
    }

    public static String normalize(String term) {
        String normalized = term == null
                ? ""
                : term.trim().replaceAll("\\s+", " ").replace('_', ' ').toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "term 1" -> "TERM_1";
            case "term 2" -> "TERM_2";
            default -> throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Term must be Term 1 or Term 2");
        };
    }
}