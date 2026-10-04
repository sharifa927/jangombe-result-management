package com.jangombe.jangombe_backend.repository;

import com.jangombe.jangombe_backend.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    Optional<Teacher> findByEmail(String email);

    Optional<Teacher> findByEmailIgnoreCase(String email);

    Optional<Teacher> findByUser_UsernameIgnoreCase(String username);

    boolean existsByEmail(String email);
}