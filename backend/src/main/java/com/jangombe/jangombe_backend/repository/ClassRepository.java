package com.jangombe.jangombe_backend.repository;

import com.jangombe.jangombe_backend.entity.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {

    Optional<ClassEntity> findByName(String name);

    boolean existsByName(String name);
}