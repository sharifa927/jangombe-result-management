package com.jangombe.jangombe_backend.service;

import com.jangombe.jangombe_backend.entity.Mark;
import com.jangombe.jangombe_backend.repository.MarkRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MarkService {

    private final MarkRepository markRepository;

    public MarkService(MarkRepository markRepository) {
        this.markRepository = markRepository;
    }

    public Mark createMark(Mark mark) {

        if (mark.getCreatedAt() == null) {
            mark.setCreatedAt(LocalDateTime.now());
        }

        mark.setUpdatedAt(LocalDateTime.now());

        return markRepository.save(mark);
    }

    public List<Mark> getAllMarks() {
        return markRepository.findAll();
    }

    public Optional<Mark> getMarkById(Long id) {
        return markRepository.findById(id);
    }

    public List<Mark> getMarksByStudent(Long studentId) {
        return markRepository.findByStudentId(studentId);
    }

    public List<Mark> getMarksBySubject(Long subjectId) {
        return markRepository.findBySubjectId(subjectId);
    }

    public List<Mark> getMarksByTeacher(Long teacherId) {
        return markRepository.findByTeacherId(teacherId);
    }

    public List<Mark> getMarksByClass(Long classId) {
        return markRepository.findByClassEntityId(classId);
    }

    public Mark updateMark(Long id, Mark updatedMark) {

        Mark existingMark = markRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mark not found"));

        existingMark.setStudent(updatedMark.getStudent());
        existingMark.setSubject(updatedMark.getSubject());
        existingMark.setTeacher(updatedMark.getTeacher());
        existingMark.setClassEntity(updatedMark.getClassEntity());
        existingMark.setAcademicYear(updatedMark.getAcademicYear());
        existingMark.setTerm(updatedMark.getTerm());
        existingMark.setMarks(updatedMark.getMarks());
        existingMark.setStatus(updatedMark.getStatus());
        existingMark.setUpdatedAt(LocalDateTime.now());

        return markRepository.save(existingMark);
    }

    public void deleteMark(Long id) {
        markRepository.deleteById(id);
    }
}