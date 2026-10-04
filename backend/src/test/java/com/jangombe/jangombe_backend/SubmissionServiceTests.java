package com.jangombe.jangombe_backend;

import com.jangombe.jangombe_backend.entity.ClassEntity;
import com.jangombe.jangombe_backend.entity.Mark;
import com.jangombe.jangombe_backend.entity.Submission;
import com.jangombe.jangombe_backend.entity.Subject;
import com.jangombe.jangombe_backend.entity.Teacher;
import com.jangombe.jangombe_backend.repository.MarkRepository;
import com.jangombe.jangombe_backend.repository.SubmissionRepository;
import com.jangombe.jangombe_backend.service.SubmissionService;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SubmissionServiceTests {

    private final SubmissionRepository submissionRepository = mock(SubmissionRepository.class);
    private final MarkRepository markRepository = mock(MarkRepository.class);
    private final SubmissionService submissionService = new SubmissionService(submissionRepository, markRepository);

    @Test
    void adminDecisionUpdatesAllMarksInTheSubmittedAssignment() {
        Submission submission = submission();
        Mark mark = new Mark();
        when(submissionRepository.findById(9L)).thenReturn(Optional.of(submission));
        when(markRepository.findByTeacherIdAndClassEntityIdAndSubjectIdAndAcademicYearAndTerm(
                7L, 12L, 3L, "2026/2027", "TERM_1")).thenReturn(List.of(mark));
        when(submissionRepository.save(submission)).thenReturn(submission);

        submissionService.updateStatus(9L, "APPROVED", null);

        assertThat(submission.getStatus()).isEqualTo("APPROVED");
        assertThat(mark.getStatus()).isEqualTo("APPROVED");
        verify(markRepository).saveAll(List.of(mark));
    }

    @Test
    void resubmissionReopensExistingAssignmentForAdminReview() {
        Submission existing = submission();
        existing.setStatus("REJECTED");
        existing.setRejectionReason("Incorrect values");
        Submission retry = submission();
        when(submissionRepository.findByTeacherIdAndClassEntityIdAndSubjectIdAndAcademicYearAndTerm(
                7L, 12L, 3L, "2026/2027", "TERM_1")).thenReturn(Optional.of(existing));
        when(submissionRepository.save(existing)).thenReturn(existing);

        Submission saved = submissionService.createSubmission(retry);

        assertThat(saved.getStatus()).isEqualTo("PENDING");
        assertThat(saved.getRejectionReason()).isNull();
        assertThat(saved.getReviewedAt()).isNull();
    }

    private Submission submission() {
        Teacher teacher = new Teacher();
        teacher.setId(7L);
        ClassEntity classEntity = new ClassEntity();
        classEntity.setId(12L);
        Subject subject = new Subject();
        subject.setId(3L);
        Submission submission = new Submission();
        submission.setId(9L);
        submission.setTeacher(teacher);
        submission.setClassEntity(classEntity);
        submission.setSubject(subject);
        submission.setAcademicYear("2026/2027");
        submission.setTerm("TERM_1");
        return submission;
    }
}