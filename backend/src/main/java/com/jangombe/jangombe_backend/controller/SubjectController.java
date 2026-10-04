package com.jangombe.jangombe_backend.controller;

import com.jangombe.jangombe_backend.entity.Subject;
import com.jangombe.jangombe_backend.service.SubjectService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Subject> createSubject(
            @RequestBody Subject subject) {

        if (subjectService.existsByCode(subject.getCode())) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                subjectService.createSubject(subject)
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(
                subjectService.getAllSubjects()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Subject> getSubjectById(
            @PathVariable Long id) {

        return subjectService.getSubjectById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Subject> updateSubject(
            @PathVariable Long id,
            @RequestBody Subject subject) {

        try {
            return ResponseEntity.ok(
                    subjectService.updateSubject(id, subject)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSubject(
            @PathVariable Long id) {

        if (subjectService.getSubjectById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        subjectService.deleteSubject(id);

        return ResponseEntity.noContent().build();
    }
}