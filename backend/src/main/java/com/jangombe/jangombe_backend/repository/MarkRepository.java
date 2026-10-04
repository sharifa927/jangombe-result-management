package com.jangombe.jangombe_backend.repository;

import com.jangombe.jangombe_backend.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarkRepository extends JpaRepository<Mark, Long> {

    List<Mark> findByStudentId(Long studentId);

    List<Mark> findBySubjectId(Long subjectId);

    List<Mark> findByTeacherId(Long teacherId);

    List<Mark> findByClassEntityId(Long classId);

    List<Mark> findByTeacherIdAndClassEntityIdAndSubjectIdAndAcademicYearAndTerm(
            Long teacherId,
            Long classId,
            Long subjectId,
            String academicYear,
            String term);
}