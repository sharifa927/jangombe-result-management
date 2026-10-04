package com.jangombe.jangombe_backend.repository;

import com.jangombe.jangombe_backend.entity.TeacherAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherAssignmentRepository extends JpaRepository<TeacherAssignment, Long> {

    List<TeacherAssignment> findByTeacherId(Long teacherId);

    List<TeacherAssignment> findByTeacherIdAndClassEntityId(Long teacherId, Long classId);

    boolean existsByTeacherIdAndClassEntityId(Long teacherId, Long classId);

    boolean existsByTeacherIdAndClassEntityIdAndSubjectId(Long teacherId, Long classId, Long subjectId);

    boolean existsByTeacherIdAndClassEntityIdAndClassTeacherTrue(Long teacherId, Long classId);

    List<TeacherAssignment> findByClassEntityId(Long classId);

    List<TeacherAssignment> findBySubjectId(Long subjectId);
}