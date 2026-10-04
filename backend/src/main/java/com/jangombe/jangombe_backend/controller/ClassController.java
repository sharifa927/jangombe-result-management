package com.jangombe.jangombe_backend.controller;

import com.jangombe.jangombe_backend.entity.ClassEntity;
import com.jangombe.jangombe_backend.service.ClassService;
import com.jangombe.jangombe_backend.service.TeacherPermissionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class ClassController {

    private final ClassService classService;
    private final TeacherPermissionService teacherPermissionService;

    public ClassController(ClassService classService, TeacherPermissionService teacherPermissionService) {
        this.classService = classService;
        this.teacherPermissionService = teacherPermissionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassEntity> createClass(
            @RequestBody ClassEntity classEntity) {

        if (classService.existsByName(classEntity.getName())) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                classService.createClass(classEntity)
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<ClassEntity>> getAllClasses(Authentication authentication) {
        if (!teacherPermissionService.isAdmin(authentication)) {
            return ResponseEntity.ok(teacherPermissionService.getAssignedClasses(authentication));
        }
        return ResponseEntity.ok(
                classService.getAllClasses()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ClassEntity> getClassById(
            @PathVariable Long id,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            teacherPermissionService.requireClassAssignment(authentication, id);
        }

        return classService.getClassById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassEntity> updateClass(
            @PathVariable Long id,
            @RequestBody ClassEntity classEntity) {

        try {
            return ResponseEntity.ok(
                    classService.updateClass(id, classEntity)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClass(
            @PathVariable Long id) {

        if (classService.getClassById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        classService.deleteClass(id);

        return ResponseEntity.noContent().build();
    }
}