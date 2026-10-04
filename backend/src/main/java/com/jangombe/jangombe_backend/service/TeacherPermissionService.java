package com.jangombe.jangombe_backend.service;

import com.jangombe.jangombe_backend.entity.Teacher;
import com.jangombe.jangombe_backend.entity.TeacherAssignment;
import com.jangombe.jangombe_backend.entity.ClassEntity;
import com.jangombe.jangombe_backend.repository.TeacherAssignmentRepository;
import com.jangombe.jangombe_backend.repository.TeacherRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.LinkedHashMap;

@Service
public class TeacherPermissionService {

    private final TeacherRepository teacherRepository;
    private final TeacherAssignmentRepository assignmentRepository;

    public TeacherPermissionService(
            TeacherRepository teacherRepository,
            TeacherAssignmentRepository assignmentRepository) {
        this.teacherRepository = teacherRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public Teacher requireTeacher(Authentication authentication) {
        String username = authentication.getName().trim();
        return teacherRepository.findByUser_UsernameIgnoreCase(username)
            .or(() -> teacherRepository.findByEmailIgnoreCase(username))
            .or(() -> teacherRepository.findByEmail(username))
                .orElseThrow(() -> new AccessDeniedException("Teacher account is not linked to a teacher record"));
    }

    public List<TeacherAssignment> getAssignments(Authentication authentication) {
        Teacher teacher = requireTeacher(authentication);
        return assignmentRepository.findByTeacherId(teacher.getId());
    }

    public List<ClassEntity> getAssignedClasses(Authentication authentication) {
        var classesById = new LinkedHashMap<Long, ClassEntity>();
        for (TeacherAssignment assignment : getAssignments(authentication)) {
            classesById.putIfAbsent(assignment.getClassEntity().getId(), assignment.getClassEntity());
        }
        return List.copyOf(classesById.values());
    }

    public boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }

    public void requireClassAssignment(Authentication authentication, Long classId) {
        Teacher teacher = requireTeacher(authentication);
        if (!assignmentRepository.existsByTeacherIdAndClassEntityId(teacher.getId(), classId)) {
            throw new AccessDeniedException("You are not assigned to this class");
        }
    }

    public void requireClassTeacher(Authentication authentication, Long classId) {
        Teacher teacher = requireTeacher(authentication);
        if (!assignmentRepository.existsByTeacherIdAndClassEntityIdAndClassTeacherTrue(teacher.getId(), classId)) {
            throw new AccessDeniedException("Only the class teacher can manage this student roster");
        }
    }

    public void requireSubjectAssignment(Authentication authentication, Long classId, Long subjectId) {
        Teacher teacher = requireTeacher(authentication);
        if (!assignmentRepository.existsByTeacherIdAndClassEntityIdAndSubjectId(teacher.getId(), classId, subjectId)) {
            throw new AccessDeniedException("You are not assigned to this subject and class");
        }
    }

    public Teacher requireOwnTeacher(Authentication authentication, Long teacherId) {
        Teacher teacher = requireTeacher(authentication);
        if (!teacher.getId().equals(teacherId)) {
            throw new AccessDeniedException("You cannot act as another teacher");
        }
        return teacher;
    }

    public boolean isClassTeacher(Authentication authentication, Long classId) {
        Teacher teacher = requireTeacher(authentication);
        return assignmentRepository.existsByTeacherIdAndClassEntityIdAndClassTeacherTrue(teacher.getId(), classId);
    }
}