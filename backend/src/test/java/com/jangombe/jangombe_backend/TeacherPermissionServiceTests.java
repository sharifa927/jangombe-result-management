package com.jangombe.jangombe_backend;

import com.jangombe.jangombe_backend.entity.Teacher;
import com.jangombe.jangombe_backend.entity.TeacherAssignment;
import com.jangombe.jangombe_backend.repository.TeacherAssignmentRepository;
import com.jangombe.jangombe_backend.repository.TeacherRepository;
import com.jangombe.jangombe_backend.service.TeacherAssignmentService;
import com.jangombe.jangombe_backend.service.TeacherPermissionService;
import org.junit.jupiter.api.Test;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class TeacherPermissionServiceTests {

    private final TeacherRepository teacherRepository = mock(TeacherRepository.class);
    private final TeacherAssignmentRepository assignmentRepository = mock(TeacherAssignmentRepository.class);
    private final TeacherPermissionService permissionService =
            new TeacherPermissionService(teacherRepository, assignmentRepository);
    private final TeacherAssignmentService assignmentService = new TeacherAssignmentService(assignmentRepository);

    @Test
    void classTeacherCanManageTheirAssignedClassRoster() {
        Authentication authentication = teacherAuthentication();
        Teacher teacher = teacher();
        when(teacherRepository.findByEmail("teacher@gmail.com")).thenReturn(Optional.of(teacher));
        when(assignmentRepository.existsByTeacherIdAndClassEntityIdAndClassTeacherTrue(7L, 12L)).thenReturn(true);

        assertThatCode(() -> permissionService.requireClassTeacher(authentication, 12L))
                .doesNotThrowAnyException();
    }

    @Test
    void subjectTeacherCannotManageRosterWithoutClassTeacherAssignment() {
        Authentication authentication = teacherAuthentication();
        when(teacherRepository.findByEmail("teacher@gmail.com")).thenReturn(Optional.of(teacher()));
        when(assignmentRepository.existsByTeacherIdAndClassEntityIdAndClassTeacherTrue(7L, 12L)).thenReturn(false);

        assertThatThrownBy(() -> permissionService.requireClassTeacher(authentication, 12L))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void resolvesTeacherFromLinkedLoginAccountBeforeContactEmail() {
        Authentication authentication = teacherAuthentication();
        Teacher teacher = teacher();
        teacher.setEmail("updated-contact@example.com");
        when(teacherRepository.findByUser_UsernameIgnoreCase("teacher@gmail.com"))
                .thenReturn(Optional.of(teacher));

        assertThat(permissionService.requireTeacher(authentication)).isSameAs(teacher);
    }

    @Test
    void assigningClassTeacherRoleTransfersItFromThePreviousTeacher() {
        TeacherAssignment previous = new TeacherAssignment();
        previous.setClassTeacher(true);
        TeacherAssignment selected = new TeacherAssignment();
        when(assignmentRepository.findByTeacherIdAndClassEntityId(7L, 12L)).thenReturn(List.of(selected));
        when(assignmentRepository.findByClassEntityId(12L)).thenReturn(List.of(previous, selected));

        assignmentService.setClassTeacherRole(7L, 12L, true);

        assertThat(previous.isClassTeacher()).isFalse();
        assertThat(selected.isClassTeacher()).isTrue();
    }

    @Test
    void classTeacherRoleCannotBeGrantedWithoutAClassAssignment() {
        when(assignmentRepository.findByTeacherIdAndClassEntityId(7L, 12L)).thenReturn(List.of());

        assertThatThrownBy(() -> assignmentService.setClassTeacherRole(7L, 12L, true))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Assign the teacher");
    }

    private Authentication teacherAuthentication() {
        return UsernamePasswordAuthenticationToken.authenticated(
                "teacher@gmail.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_TEACHER")));
    }

    private Teacher teacher() {
        Teacher teacher = new Teacher();
        teacher.setId(7L);
        teacher.setEmail("teacher@gmail.com");
        return teacher;
    }
}