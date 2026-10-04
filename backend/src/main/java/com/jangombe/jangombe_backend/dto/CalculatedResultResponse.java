package com.jangombe.jangombe_backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record CalculatedResultResponse(
        Long studentId,
        String studentName,
        String admissionNumber,
        BigDecimal totalMarks,
        BigDecimal average,
        String overallGrade,
        int position,
        List<SubjectResult> subjects) {

    public record SubjectResult(
            Long subjectId,
            String subjectName,
            BigDecimal marks,
            String grade) {
    }
}