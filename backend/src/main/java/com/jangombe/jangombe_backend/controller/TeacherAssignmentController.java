package com.jangombe.jangombe_backend.controller;

import com.jangombe.jangombe_backend.entity.TeacherAssignment;
import com.jangombe.jangombe_backend.dto.AssignmentSavedResponse;
import com.jangombe.jangombe_backend.service.TeacherAssignmentService;
import com.jangombe.jangombe_backend.service.TeacherPermissionService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class TeacherAssignmentController {

    private final TeacherAssignmentService assignmentService;
    private final TeacherPermissionService teacherPermissionService;

    public TeacherAssignmentController(
            TeacherAssignmentService assignmentService,
            TeacherPermissionService teacherPermissionService) {
        this.assignmentService = assignmentService;
        this.teacherPermissionService = teacherPermissionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AssignmentSavedResponse> createAssignment(
            @RequestBody TeacherAssignment assignment) {

        TeacherAssignment saved = assignmentService.createAssignment(assignment);
        return ResponseEntity.ok(AssignmentSavedResponse.from(saved));
    }

    @PutMapping("/class-teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> setClassTeacherRole(@RequestBody ClassTeacherRoleRequest request) {
        if (request.teacherId() == null || request.classId() == null) {
            return ResponseEntity.badRequest().body("Teacher and class are required");
        }
        try {
            assignmentService.setClassTeacherRole(request.teacherId(), request.classId(), request.classTeacher());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TeacherAssignment>> getAllAssignments() {
        return ResponseEntity.ok(
                assignmentService.getAllAssignments()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherAssignment> getAssignmentById(
            @PathVariable Long id) {

        return assignmentService.getAssignmentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<TeacherAssignment>> getByTeacher(
            @PathVariable Long teacherId,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)
                && !teacherPermissionService.requireTeacher(authentication).getId().equals(teacherId)) {
            throw new AccessDeniedException("You cannot view another teacher's assignments");
        }

        return ResponseEntity.ok(
                assignmentService.getAssignmentsByTeacher(teacherId)
        );
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<TeacherAssignment>> getMyAssignments(Authentication authentication) {
        return ResponseEntity.ok(teacherPermissionService.getAssignments(authentication));
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TeacherAssignment>> getByClass(
            @PathVariable Long classId) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentsByClass(classId)
        );
    }

    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TeacherAssignment>> getBySubject(
            @PathVariable Long subjectId) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentsBySubject(subjectId)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAssignment(
            @PathVariable Long id) {

        if (assignmentService.getAssignmentById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        assignmentService.deleteAssignment(id);

        return ResponseEntity.noContent().build();
    }

    public record ClassTeacherRoleRequest(Long teacherId, Long classId, boolean classTeacher) {}
}