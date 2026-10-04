package com.jangombe.jangombe_backend.service;

import com.jangombe.jangombe_backend.entity.TeacherAssignment;
import com.jangombe.jangombe_backend.repository.TeacherAssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TeacherAssignmentService {

    private final TeacherAssignmentRepository assignmentRepository;

    public TeacherAssignmentService(TeacherAssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    @Transactional
    public TeacherAssignment createAssignment(TeacherAssignment assignment) {
        if (assignment.isClassTeacher()) {
            List<TeacherAssignment> classAssignments = assignmentRepository
                    .findByClassEntityId(assignment.getClassEntity().getId());
            classAssignments.forEach(existing -> existing.setClassTeacher(false));
            assignmentRepository.saveAll(classAssignments);
        }
        return assignmentRepository.save(assignment);
    }

    @Transactional
    public void setClassTeacherRole(Long teacherId, Long classId, boolean classTeacher) {
        List<TeacherAssignment> teacherAssignments = assignmentRepository
                .findByTeacherIdAndClassEntityId(teacherId, classId);
        if (teacherAssignments.isEmpty()) {
            throw new IllegalArgumentException("Assign the teacher to a subject in this class first");
        }

        if (classTeacher) {
            List<TeacherAssignment> classAssignments = assignmentRepository.findByClassEntityId(classId);
            classAssignments.forEach(assignment -> assignment.setClassTeacher(false));
            teacherAssignments.get(0).setClassTeacher(true);
            assignmentRepository.saveAll(classAssignments);
        } else {
            teacherAssignments.forEach(assignment -> assignment.setClassTeacher(false));
            assignmentRepository.saveAll(teacherAssignments);
        }
    }

    public List<TeacherAssignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<TeacherAssignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }

    public List<TeacherAssignment> getAssignmentsByTeacher(Long teacherId) {
        return assignmentRepository.findByTeacherId(teacherId);
    }

    public List<TeacherAssignment> getAssignmentsByClass(Long classId) {
        return assignmentRepository.findByClassEntityId(classId);
    }

    public List<TeacherAssignment> getAssignmentsBySubject(Long subjectId) {
        return assignmentRepository.findBySubjectId(subjectId);
    }

    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }
}