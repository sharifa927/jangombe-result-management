package com.jangombe.jangombe_backend.controller;

import com.jangombe.jangombe_backend.entity.Mark;
import com.jangombe.jangombe_backend.entity.Student;
import com.jangombe.jangombe_backend.service.MarkService;
import com.jangombe.jangombe_backend.service.StudentService;
import com.jangombe.jangombe_backend.service.TeacherPermissionService;
import com.jangombe.jangombe_backend.util.AcademicTerm;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class MarkController {

    private final MarkService markService;
    private final StudentService studentService;
    private final TeacherPermissionService teacherPermissionService;

    public MarkController(
            MarkService markService,
            StudentService studentService,
            TeacherPermissionService teacherPermissionService) {
        this.markService = markService;
        this.studentService = studentService;
        this.teacherPermissionService = teacherPermissionService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Mark> createMark(
            @RequestBody Mark mark,
            Authentication authentication) {

        mark.setTerm(AcademicTerm.normalize(mark.getTerm()));
        if (!teacherPermissionService.isAdmin(authentication)) {
            validateTeacherMark(authentication, mark);
        }

        return ResponseEntity.ok(
                markService.createMark(mark)
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Mark>> getAllMarks() {
        return ResponseEntity.ok(
                markService.getAllMarks()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Mark> getMarkById(
            @PathVariable Long id,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            Mark mark = markService.getMarkById(id).orElse(null);
            if (mark == null) return ResponseEntity.notFound().build();
            validateTeacherMark(authentication, mark);
            return ResponseEntity.ok(mark);
        }

        return markService.getMarkById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<Mark>> getByStudent(
            @PathVariable Long studentId,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            Student student = studentService.getStudentById(studentId).orElse(null);
            if (student == null) return ResponseEntity.notFound().build();
            teacherPermissionService.requireClassAssignment(authentication, student.getClassEntity().getId());
            Long teacherId = teacherPermissionService.requireTeacher(authentication).getId();
            return ResponseEntity.ok(markService.getMarksByStudent(studentId).stream()
                    .filter(mark -> mark.getTeacher().getId().equals(teacherId)).toList());
        }

        return ResponseEntity.ok(
                markService.getMarksByStudent(studentId)
        );
    }

    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Mark>> getBySubject(
            @PathVariable Long subjectId) {

        return ResponseEntity.ok(
                markService.getMarksBySubject(subjectId)
        );
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<Mark>> getByTeacher(
            @PathVariable Long teacherId,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            teacherPermissionService.requireOwnTeacher(authentication, teacherId);
        }

        return ResponseEntity.ok(
                markService.getMarksByTeacher(teacherId)
        );
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<Mark>> getMyMarks(Authentication authentication) {
        Long teacherId = teacherPermissionService.requireTeacher(authentication).getId();
        return ResponseEntity.ok(markService.getMarksByTeacher(teacherId));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<Mark>> getByClass(
            @PathVariable Long classId,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            teacherPermissionService.requireClassAssignment(authentication, classId);
            Long teacherId = teacherPermissionService.requireTeacher(authentication).getId();
            return ResponseEntity.ok(markService.getMarksByClass(classId).stream()
                    .filter(mark -> mark.getTeacher().getId().equals(teacherId)).toList());
        }

        return ResponseEntity.ok(
                markService.getMarksByClass(classId)
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Mark> updateMark(
            @PathVariable Long id,
            @RequestBody Mark mark,
            Authentication authentication) {

        mark.setTerm(AcademicTerm.normalize(mark.getTerm()));
        try {
            if (!teacherPermissionService.isAdmin(authentication)) {
                Mark existingMark = markService.getMarkById(id)
                        .orElseThrow(() -> new RuntimeException("Mark not found"));
                validateTeacherMark(authentication, existingMark);
                validateTeacherMark(authentication, mark);
            }
            return ResponseEntity.ok(
                    markService.updateMark(id, mark)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> deleteMark(
            @PathVariable Long id,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            Mark mark = markService.getMarkById(id).orElse(null);
            if (mark == null) return ResponseEntity.notFound().build();
            validateTeacherMark(authentication, mark);
        }

        if (markService.getMarkById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        markService.deleteMark(id);

        return ResponseEntity.noContent().build();
    }

    private void validateTeacherMark(Authentication authentication, Mark mark) {
        if (mark.getTeacher() == null || mark.getClassEntity() == null || mark.getSubject() == null
                || mark.getStudent() == null) {
            throw new org.springframework.security.access.AccessDeniedException("Mark assignment is incomplete");
        }
        Long teacherId = teacherPermissionService.requireTeacher(authentication).getId();
        teacherPermissionService.requireOwnTeacher(authentication, mark.getTeacher().getId());
        teacherPermissionService.requireSubjectAssignment(
                authentication,
                mark.getClassEntity().getId(),
                mark.getSubject().getId());
        Student student = studentService.getStudentById(mark.getStudent().getId()).orElse(null);
        if (student == null || !student.getClassEntity().getId().equals(mark.getClassEntity().getId())
                || !mark.getTeacher().getId().equals(teacherId)) {
            throw new org.springframework.security.access.AccessDeniedException("Mark is outside your assignment");
        }
    }
}