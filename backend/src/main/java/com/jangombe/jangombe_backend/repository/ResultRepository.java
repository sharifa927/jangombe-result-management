package com.jangombe.jangombe_backend.repository;

import com.jangombe.jangombe_backend.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByClassEntityId(Long classId);

    Optional<Result> findByStudentIdAndAcademicYearAndTerm(
            Long studentId,
            String academicYear,
            String term
    );
}