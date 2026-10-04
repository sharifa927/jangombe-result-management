package com.jangombe.jangombe_backend.controller;

import com.jangombe.jangombe_backend.entity.ClassEntity;
import com.jangombe.jangombe_backend.entity.Student;
import com.jangombe.jangombe_backend.entity.Subject;
import com.jangombe.jangombe_backend.entity.Submission;
import com.jangombe.jangombe_backend.util.AcademicTerm;
import com.jangombe.jangombe_backend.entity.Teacher;
import com.jangombe.jangombe_backend.service.ClassService;
import com.jangombe.jangombe_backend.service.ResultService;
import com.jangombe.jangombe_backend.service.StudentService;
import com.jangombe.jangombe_backend.service.SubmissionService;
import com.jangombe.jangombe_backend.service.SubjectService;
import com.jangombe.jangombe_backend.service.TeacherService;
import com.jangombe.jangombe_backend.service.TeacherPermissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class SubmissionController {

    private final SubmissionService submissionService;
    private final TeacherService teacherService;
    private final StudentService studentService;
    private final ClassService classService;
    private final SubjectService subjectService;
    private final ResultService resultService;
    private final TeacherPermissionService teacherPermissionService;

    public SubmissionController(
            SubmissionService submissionService,
            TeacherService teacherService,
            StudentService studentService,
            ClassService classService,
            SubjectService subjectService,
            ResultService resultService,
            TeacherPermissionService teacherPermissionService) {
        this.submissionService = submissionService;
        this.teacherService = teacherService;
        this.studentService = studentService;
        this.classService = classService;
        this.subjectService = subjectService;
        this.resultService = resultService;
        this.teacherPermissionService = teacherPermissionService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Submission> createSubmission(
            @RequestBody Submission submission,
            Authentication authentication) {

        submission.setTerm(AcademicTerm.normalize(submission.getTerm()));
        if (!teacherPermissionService.isAdmin(authentication)) {
            if (submission.getTeacher() == null || submission.getClassEntity() == null || submission.getSubject() == null) {
                return ResponseEntity.badRequest().build();
            }
            teacherPermissionService.requireOwnTeacher(authentication, submission.getTeacher().getId());
            teacherPermissionService.requireSubjectAssignment(
                    authentication,
                    submission.getClassEntity().getId(),
                    submission.getSubject().getId());
        }

        return ResponseEntity.ok(
                submissionService.createSubmission(submission)
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Submission>> getAllSubmissions() {
        return ResponseEntity.ok(
                submissionService.getAllSubmissions()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Submission> getSubmissionById(
            @PathVariable Long id) {

        return submissionService.getSubmissionById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Submission>> getPendingSubmissions() {
        return ResponseEntity.ok(
                submissionService.getPendingSubmissions()
        );
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDashboardSummary() {
        List<Teacher> teachers = teacherService.getAllTeachers();
        List<Student> students = studentService.getAllStudents();
        List<ClassEntity> classes = classService.getAllClasses();
        List<Subject> subjects = subjectService.getAllSubjects();
        List<Submission> recent = submissionService.getRecentSubmissions();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTeachers", teachers.size());
        stats.put("totalStudents", students.size());
        stats.put("totalClasses", classes.size());
        stats.put("totalSubjects", subjects.size());
        stats.put("pendingSubmissions", submissionService.countPendingSubmissions());
        stats.put("completedResults", resultService.getAllResults().size());

        List<Map<String, Object>> recentSubmissions = new ArrayList<>();
        for (Submission submission : recent) {
            Map<String, Object> item = new HashMap<>();
            item.put("teacher", submission.getTeacher() != null && submission.getTeacher().getUser() != null
                    ? submission.getTeacher().getFirstName() + " " + submission.getTeacher().getLastName()
                    : "Unknown Teacher");
            item.put("className", submission.getClassEntity() != null ? submission.getClassEntity().getName() : "Unknown Class");
            item.put("subject", submission.getSubject() != null ? submission.getSubject().getName() : "Unknown Subject");
            item.put("term", submission.getTerm());
            item.put("date", submission.getSubmittedAt() != null ? submission.getSubmittedAt().toLocalDate().toString() : "");
            item.put("status", submission.getStatus() != null ? submission.getStatus() : "PENDING");
            recentSubmissions.add(item);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("stats", stats);
        payload.put("recentSubmissions", recentSubmissions);

        return ResponseEntity.ok(payload);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<Submission>> getMySubmissions(Authentication authentication) {
        Long teacherId = teacherPermissionService.requireTeacher(authentication).getId();
        return ResponseEntity.ok(submissionService.getSubmissionsByTeacher(teacherId));
    }

    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<Submission>> getByTeacher(
            @PathVariable Long teacherId,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            teacherPermissionService.requireOwnTeacher(authentication, teacherId);
        }

        return ResponseEntity.ok(
                submissionService.getSubmissionsByTeacher(teacherId)
        );
    }

    @GetMapping("/class/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<Submission>> getByClass(
            @PathVariable Long classId,
            Authentication authentication) {

        if (!teacherPermissionService.isAdmin(authentication)) {
            teacherPermissionService.requireClassAssignment(authentication, classId);
        }

        return ResponseEntity.ok(
                submissionService.getSubmissionsByClass(classId)
        );
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Submission> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String rejectionReason) {

        try {
            return ResponseEntity.ok(
                    submissionService.updateStatus(
                            id,
                            status,
                            rejectionReason
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSubmission(
            @PathVariable Long id) {

        if (submissionService.getSubmissionById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        submissionService.deleteSubmission(id);

        return ResponseEntity.noContent().build();
    }
}