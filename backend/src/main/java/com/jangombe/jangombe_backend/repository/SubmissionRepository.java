package com.jangombe.jangombe_backend.repository;

import com.jangombe.jangombe_backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByStatus(String status);

    long countByStatus(String status);

    List<Submission> findTop5ByOrderBySubmittedAtDesc();

    List<Submission> findByTeacherId(Long teacherId);

    List<Submission> findByClassEntityId(Long classId);

        Optional<Submission> findByTeacherIdAndClassEntityIdAndSubjectIdAndAcademicYearAndTerm(
            Long teacherId,
            Long classId,
            Long subjectId,
            String academicYear,
            String term);

    List<Submission> findByClassEntityIdAndAcademicYearAndTermAndStatus(
            Long classId,
            String academicYear,
            String term,
            String status);
}