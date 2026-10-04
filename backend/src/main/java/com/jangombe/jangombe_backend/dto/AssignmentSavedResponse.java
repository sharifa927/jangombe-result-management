package com.jangombe.jangombe_backend.dto;

import com.jangombe.jangombe_backend.entity.TeacherAssignment;

public record AssignmentSavedResponse(
        Long id,
        Long teacherId,
        Long classId,
        Long subjectId,
        boolean classTeacher) {

    public static AssignmentSavedResponse from(TeacherAssignment assignment) {
        return new AssignmentSavedResponse(
                assignment.getId(),
                assignment.getTeacher().getId(),
                assignment.getClassEntity().getId(),
                assignment.getSubject().getId(),
                assignment.isClassTeacher());
    }
}