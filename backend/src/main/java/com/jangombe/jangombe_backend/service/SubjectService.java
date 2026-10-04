package com.jangombe.jangombe_backend.service;

import com.jangombe.jangombe_backend.entity.Subject;
import com.jangombe.jangombe_backend.repository.SubjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Optional<Subject> getSubjectById(Long id) {
        return subjectRepository.findById(id);
    }

    public Optional<Subject> findByCode(String code) {
        return subjectRepository.findByCode(code);
    }

    public boolean existsByCode(String code) {
        return subjectRepository.existsByCode(code);
    }

    public Subject updateSubject(Long id, Subject updatedSubject) {

        Subject existingSubject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        existingSubject.setName(updatedSubject.getName());
        existingSubject.setCode(updatedSubject.getCode());
        existingSubject.setStatus(updatedSubject.getStatus());

        return subjectRepository.save(existingSubject);
    }

    public void deleteSubject(Long id) {
        subjectRepository.deleteById(id);
    }
}