package com.jangombe.jangombe_backend.controller;

import com.jangombe.jangombe_backend.dto.TeacherCreateRequest;
import com.jangombe.jangombe_backend.dto.TeacherProfileUpdateRequest;
import com.jangombe.jangombe_backend.entity.Teacher;
import com.jangombe.jangombe_backend.service.TeacherService;
import com.jangombe.jangombe_backend.service.TeacherPermissionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class TeacherController {

    private final TeacherService teacherService;
    private final TeacherPermissionService teacherPermissionService;
    private final SecurityContextRepository securityContextRepository;

    public TeacherController(
            TeacherService teacherService,
            TeacherPermissionService teacherPermissionService,
            SecurityContextRepository securityContextRepository) {
        this.teacherService = teacherService;
        this.teacherPermissionService = teacherPermissionService;
        this.securityContextRepository = securityContextRepository;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Teacher> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(teacherPermissionService.requireTeacher(authentication));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> updateMyProfile(
            @Valid @RequestBody TeacherProfileUpdateRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {
        try {
            Teacher teacher = teacherPermissionService.requireTeacher(authentication);
            Teacher updated = teacherService.updateMyProfile(teacher.getId(), request);
            var updatedAuthentication = UsernamePasswordAuthenticationToken.authenticated(
                    updated.getUser().getUsername(),
                    authentication.getCredentials(),
                    authentication.getAuthorities());
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(updatedAuthentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, httpRequest, httpResponse);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTeacher(@RequestBody TeacherCreateRequest request) {

        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        if (request.getFirstName() == null || request.getFirstName().isEmpty()) {
            return ResponseEntity.badRequest().body("First name is required");
        }

        try {
            Teacher savedTeacher = teacherService.createTeacher(request);
            return ResponseEntity.ok(savedTeacher);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Teacher>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable Long id) {

        return teacherService.getTeacherById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTeacher(
            @PathVariable Long id,
            @RequestBody Teacher teacher) {

        try {
            Teacher updatedTeacher = teacherService.updateTeacher(id, teacher);
            return ResponseEntity.ok(updatedTeacher);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {

        if (teacherService.getTeacherById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        teacherService.deleteTeacher(id);

        return ResponseEntity.noContent().build();
    }
}