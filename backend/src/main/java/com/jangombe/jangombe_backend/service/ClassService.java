package com.jangombe.jangombe_backend.service;

import com.jangombe.jangombe_backend.entity.ClassEntity;
import com.jangombe.jangombe_backend.repository.ClassRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClassService {

    private final ClassRepository classRepository;

    public ClassService(ClassRepository classRepository) {
        this.classRepository = classRepository;
    }

    public ClassEntity createClass(ClassEntity classEntity) {
        return classRepository.save(classEntity);
    }

    public List<ClassEntity> getAllClasses() {
        return classRepository.findAll();
    }

    public Optional<ClassEntity> getClassById(Long id) {
        return classRepository.findById(id);
    }

    public Optional<ClassEntity> findByName(String name) {
        return classRepository.findByName(name);
    }

    public boolean existsByName(String name) {
        return classRepository.existsByName(name);
    }

    public ClassEntity updateClass(Long id, ClassEntity updatedClass) {

        ClassEntity existingClass = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        existingClass.setName(updatedClass.getName());
        existingClass.setAcademicYear(updatedClass.getAcademicYear());
        existingClass.setStatus(updatedClass.getStatus());

        return classRepository.save(existingClass);
    }

    public void deleteClass(Long id) {
        classRepository.deleteById(id);
    }
}
