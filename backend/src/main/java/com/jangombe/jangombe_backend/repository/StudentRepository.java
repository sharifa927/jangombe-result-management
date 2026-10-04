package com.jangombe.jangombe_backend.repository;

import com.jangombe.jangombe_backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByAdmissionNumber(String admissionNumber);

    List<Student> findByClassEntityId(Long classId);

    boolean existsByAdmissionNumber(String admissionNumber);
}