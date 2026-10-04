package com.jangombe.jangombe_backend.service;

import com.jangombe.jangombe_backend.entity.Student;
import com.jangombe.jangombe_backend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student createStudent(Student student) {
        student.setGender(normalizeGender(student.getGender()));
        student.setStatus(normalizeStatus(student.getStatus()));
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<Student> findByAdmissionNumber(String admissionNumber) {
        return studentRepository.findByAdmissionNumber(admissionNumber);
    }

    public List<Student> getStudentsByClass(Long classId) {
        return studentRepository.findByClassEntityId(classId);
    }

    public boolean existsByAdmissionNumber(String admissionNumber) {
        return studentRepository.existsByAdmissionNumber(admissionNumber);
    }

    public Student updateStudent(Long id, Student updatedStudent) {

        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        existingStudent.setAdmissionNumber(updatedStudent.getAdmissionNumber());
        existingStudent.setFirstName(updatedStudent.getFirstName());
        existingStudent.setLastName(updatedStudent.getLastName());
        existingStudent.setDateOfBirth(updatedStudent.getDateOfBirth());
        existingStudent.setGender(normalizeGender(updatedStudent.getGender()));
        existingStudent.setClassEntity(updatedStudent.getClassEntity());
        existingStudent.setStatus(normalizeStatus(updatedStudent.getStatus()));

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    private String normalizeGender(String gender) {
        return gender == null ? null : gender.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeStatus(String status) {
        return status == null ? null : status.trim().toUpperCase(Locale.ROOT);
    }
}