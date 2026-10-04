package com.jangombe.jangombe_backend.service;

import com.jangombe.jangombe_backend.dto.TeacherCreateRequest;
import com.jangombe.jangombe_backend.dto.TeacherProfileUpdateRequest;
import com.jangombe.jangombe_backend.entity.Teacher;
import com.jangombe.jangombe_backend.entity.User;
import com.jangombe.jangombe_backend.repository.TeacherRepository;
import com.jangombe.jangombe_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Locale;

@Service
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherService(
            TeacherRepository teacherRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Teacher createTeacher(TeacherCreateRequest request) {

        String email = normalizeAndValidateEmail(request.getEmail());
        String password = request.getPassword();
        validatePassword(password);
        request.setEmail(email);

        // Check if the email is already used by another teacher
        if (teacherRepository.existsByEmail(email)) {
            throw new RuntimeException("A teacher with this email already exists");
        }

        // Check if the username/email already exists as a user
        if (userRepository.existsByUsername(email)) {
            throw new RuntimeException("A user with this email already exists");
        }

        // Create the user account with encoded password
        User user = new User();
        user.setUsername(email);
        
        // Hash the password using BCrypt
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("TEACHER");

        User savedUser = userRepository.save(user);

        // Create the teacher entity
        Teacher teacher = new Teacher();
        teacher.setFirstName(request.getFirstName());
        teacher.setLastName(request.getLastName());
        teacher.setEmail(request.getEmail());
        teacher.setPhone(request.getPhone());
        teacher.setStatus(request.getStatus());
        teacher.setUser(savedUser);

        // Save the teacher
        return teacherRepository.save(teacher);
    }
    
    @Transactional
    public Teacher createTeacher(Teacher teacher) {

        String email = normalizeAndValidateEmail(teacher.getEmail());
        teacher.setEmail(email);

        // Check if the email is already used by another teacher
        if (teacherRepository.existsByEmail(email)) {
            throw new RuntimeException("A teacher with this email already exists");
        }

        // Check if the username/email already exists as a user
        if (userRepository.existsByUsername(email)) {
            throw new RuntimeException("A user with this email already exists");
        }

        // Create the user account
        User user = new User();
        user.setUsername(email);
        user.setPassword(passwordEncoder.encode("Teacher123"));
        user.setRole("TEACHER");

        User savedUser = userRepository.save(user);

        // Connect the teacher to the newly created user
        teacher.setUser(savedUser);

        // Save the teacher
        return teacherRepository.save(teacher);
    }

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Optional<Teacher> getTeacherById(Long id) {
        return teacherRepository.findById(id);
    }

    public Optional<Teacher> findByEmail(String email) {
        return teacherRepository.findByEmail(email);
    }

    private String normalizeAndValidateEmail(String email) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
        if (!normalizedEmail.matches("^[a-z0-9._%+-]+@gmail\\.com$")) {
            throw new IllegalArgumentException("Email must be a valid @gmail.com address");
        }
        return normalizedEmail;
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 8 || password.length() > 72
                || !password.matches("(?s).*[A-Z].*")) {
            throw new IllegalArgumentException(
                    "Password must be 8 to 72 characters and include at least one capital letter");
        }
    }

    @Transactional
    public Teacher updateMyProfile(Long teacherId, TeacherProfileUpdateRequest request) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new IllegalArgumentException("Teacher profile not found"));
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (!email.matches("^[a-z0-9._%+-]+@gmail\\.com$")) {
            throw new IllegalArgumentException("Email must be a valid @gmail.com address");
        }

        teacherRepository.findByEmailIgnoreCase(email)
                .filter(existing -> !existing.getId().equals(teacherId))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("That email is already used by another teacher");
                });
        userRepository.findByUsernameIgnoreCase(email)
                .filter(existing -> !existing.getId().equals(teacher.getUser().getId()))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("That email is already used by another account");
                });

        teacher.setFirstName(request.getFirstName().trim());
        teacher.setLastName(request.getLastName().trim());
        teacher.setEmail(email);
        teacher.setPhone(request.getPhone() == null || request.getPhone().isBlank()
                ? null
                : request.getPhone().trim());
        teacher.getUser().setUsername(email);
        userRepository.save(teacher.getUser());
        return teacherRepository.save(teacher);
    }

    public boolean existsByEmail(String email) {
        return teacherRepository.existsByEmail(email);
    }

    @Transactional
    public Teacher updateTeacher(Long id, Teacher updatedTeacher) {

        Teacher existingTeacher = teacherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        String email = normalizeAndValidateEmail(updatedTeacher.getEmail());

        teacherRepository.findByEmailIgnoreCase(email)
            .filter(teacher -> !teacher.getId().equals(id))
            .ifPresent(teacher -> {
                throw new IllegalArgumentException("That email is already used by another teacher");
            });
        userRepository.findByUsernameIgnoreCase(email)
            .filter(user -> !user.getId().equals(existingTeacher.getUser().getId()))
            .ifPresent(user -> {
                throw new IllegalArgumentException("That email is already used by another account");
            });

        existingTeacher.setFirstName(updatedTeacher.getFirstName());
        existingTeacher.setLastName(updatedTeacher.getLastName());
        existingTeacher.setEmail(email);
        existingTeacher.setPhone(updatedTeacher.getPhone());
        existingTeacher.setStatus(updatedTeacher.getStatus());
        existingTeacher.getUser().setUsername(email);
        userRepository.save(existingTeacher.getUser());

        return teacherRepository.save(existingTeacher);
    }

    public void deleteTeacher(Long id) {
        teacherRepository.deleteById(id);
    }
}
