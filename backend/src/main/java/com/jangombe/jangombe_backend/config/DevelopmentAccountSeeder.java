package com.jangombe.jangombe_backend.config;

import com.jangombe.jangombe_backend.entity.Teacher;
import com.jangombe.jangombe_backend.entity.User;
import com.jangombe.jangombe_backend.repository.TeacherRepository;
import com.jangombe.jangombe_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("!prod & !production")
public class DevelopmentAccountSeeder implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "admin@gmail.com";
    private static final String TEACHER_EMAIL = "teacher@gmail.com";

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;

    public DevelopmentAccountSeeder(
            UserRepository userRepository,
            TeacherRepository teacherRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        userRepository.findByUsername(ADMIN_EMAIL)
                .orElseGet(() -> userRepository.save(createUser(ADMIN_EMAIL, "admin123", "ADMIN")));

        User teacherUser = userRepository.findByUsername(TEACHER_EMAIL)
                .orElseGet(() -> userRepository.save(createUser(TEACHER_EMAIL, "teacher123", "TEACHER")));

        if (!teacherRepository.existsByEmail(TEACHER_EMAIL)) {
            Teacher teacher = new Teacher();
            teacher.setUser(teacherUser);
            teacher.setFirstName("Test");
            teacher.setLastName("Teacher");
            teacher.setEmail(TEACHER_EMAIL);
            teacherRepository.save(teacher);
        }
    }

    private User createUser(String username, String rawPassword, String role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        return user;
    }
}