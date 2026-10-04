package com.jangombe.jangombe_backend.service;

import com.jangombe.jangombe_backend.entity.Submission;
import com.jangombe.jangombe_backend.repository.MarkRepository;
import com.jangombe.jangombe_backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final MarkRepository markRepository;

    public SubmissionService(SubmissionRepository submissionRepository, MarkRepository markRepository) {
        this.submissionRepository = submissionRepository;
        this.markRepository = markRepository;
    }

    @Transactional
    public Submission createSubmission(Submission submission) {
        LocalDateTime submittedAt = LocalDateTime.now();
        Submission existing = submissionRepository
                .findByTeacherIdAndClassEntityIdAndSubjectIdAndAcademicYearAndTerm(
                        submission.getTeacher().getId(),
                        submission.getClassEntity().getId(),
                        submission.getSubject().getId(),
                        submission.getAcademicYear(),
                        submission.getTerm())
                .orElse(submission);
        existing.setStatus("PENDING");
        existing.setRejectionReason(null);
        existing.setReviewedAt(null);
        existing.setSubmittedAt(submittedAt);
        return submissionRepository.save(existing);
    }

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    public Optional<Submission> getSubmissionById(Long id) {
        return submissionRepository.findById(id);
    }

    public List<Submission> getPendingSubmissions() {
        return submissionRepository.findByStatus("PENDING");
    }

    public List<Submission> getSubmissionsByTeacher(Long teacherId) {
        return submissionRepository.findByTeacherId(teacherId);
    }

    public List<Submission> getSubmissionsByClass(Long classId) {
        return submissionRepository.findByClassEntityId(classId);
    }

    public long countPendingSubmissions() {
        return submissionRepository.countByStatus("PENDING");
    }

    public List<Submission> getRecentSubmissions() {
        return submissionRepository.findTop5ByOrderBySubmittedAtDesc();
    }

    @Transactional
    public Submission updateStatus(Long id, String status, String rejectionReason) {

        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        submission.setStatus(status);
        submission.setRejectionReason(rejectionReason);

        if (status.equals("APPROVED") || status.equals("REJECTED")) {
            submission.setReviewedAt(LocalDateTime.now());
            var marks = markRepository.findByTeacherIdAndClassEntityIdAndSubjectIdAndAcademicYearAndTerm(
                    submission.getTeacher().getId(),
                    submission.getClassEntity().getId(),
                    submission.getSubject().getId(),
                    submission.getAcademicYear(),
                    submission.getTerm());
            marks.forEach(mark -> mark.setStatus(status));
            markRepository.saveAll(marks);
        }

        return submissionRepository.save(submission);
    }

    public void deleteSubmission(Long id) {
        submissionRepository.deleteById(id);
    }
}