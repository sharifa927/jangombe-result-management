package com.jangombe.jangombe_backend.controller;

import com.jangombe.jangombe_backend.entity.Student;
import com.jangombe.jangombe_backend.service.StudentService;
import com.jangombe.jangombe_backend.service.TeacherPermissionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class StudentController {

    private final StudentService studentService;
    private final TeacherPermissionService teacherPermissionService;

    public StudentController(StudentService studentService, TeacherPermissionService teacherPermissionService) {
        this.studentService = studentService;
        this.teacherPermissionService = teacherPermissionService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Student> createStudent(
            @RequestBody Student student,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            if (student.getClassEntity() == null || student.getClassEntity().getId() == null) {
                return ResponseEntity.badRequest().build();
            }
            teacherPermissionService.requireClassTeacher(authentication, student.getClassEntity().getId());
        }

        if (studentService.existsByAdmissionNumber(
                student.getAdmissionNumber())) {

            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                studentService.createStudent(student)
        );
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<Student>> getAllStudents(Authentication authentication) {
        if (!teacherPermissionService.isAdmin(authentication)) {
            return ResponseEntity.ok(teacherPermissionService.getAssignedClasses(authentication).stream()
                    .flatMap(classEntity -> studentService.getStudentsByClass(classEntity.getId()).stream())
                    .toList());
        }
        return ResponseEntity.ok(
                studentService.getAllStudents()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Student> getStudentById(
            @PathVariable Long id,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            Student student = studentService.getStudentById(id).orElse(null);
            if (student == null) return ResponseEntity.notFound().build();
            teacherPermissionService.requireClassAssignment(authentication, student.getClassEntity().getId());
            return ResponseEntity.ok(student);
        }

        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<Student>> getStudentsByClass(
            @PathVariable Long classId,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            teacherPermissionService.requireClassAssignment(authentication, classId);
        }

        return ResponseEntity.ok(
                studentService.getStudentsByClass(classId)
        );
    }

    @GetMapping("/admission/{admissionNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Student> getByAdmissionNumber(
            @PathVariable String admissionNumber,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            Student student = studentService.findByAdmissionNumber(admissionNumber).orElse(null);
            if (student == null) return ResponseEntity.notFound().build();
            teacherPermissionService.requireClassAssignment(authentication, student.getClassEntity().getId());
            return ResponseEntity.ok(student);
        }

        return studentService.findByAdmissionNumber(admissionNumber)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestBody Student student,
            Authentication authentication) {

        try {
            if (!teacherPermissionService.isAdmin(authentication)) {
                Student existingStudent = studentService.getStudentById(id)
                        .orElseThrow(() -> new RuntimeException("Student not found"));
                teacherPermissionService.requireClassTeacher(authentication, existingStudent.getClassEntity().getId());
                if (student.getClassEntity() == null || student.getClassEntity().getId() == null) {
                    return ResponseEntity.badRequest().build();
                }
                teacherPermissionService.requireClassTeacher(authentication, student.getClassEntity().getId());
            }
            return ResponseEntity.ok(
                    studentService.updateStudent(id, student)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> deleteStudent(
            @PathVariable Long id,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            Student student = studentService.getStudentById(id).orElse(null);
            if (student == null) return ResponseEntity.notFound().build();
            teacherPermissionService.requireClassTeacher(authentication, student.getClassEntity().getId());
        }

        if (studentService.getStudentById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        studentService.deleteStudent(id);

        return ResponseEntity.noContent().build();
    }
}