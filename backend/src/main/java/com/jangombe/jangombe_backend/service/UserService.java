package com.jangombe.jangombe_backend.service;

import com.jangombe.jangombe_backend.entity.User;
import com.jangombe.jangombe_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean isPasswordValid(String rawPassword, String storedPassword) {
        if (storedPassword == null || rawPassword == null) {
            return false;
        }

        return passwordEncoder.matches(rawPassword, storedPassword)
                || rawPassword.equals(storedPassword);
    }

    public void upgradeLegacyPassword(User user, String rawPassword) {
        if (user == null || rawPassword == null || user.getPassword() == null) {
            return;
        }

        String storedPassword = user.getPassword();
        boolean isLegacyPlainText = !storedPassword.startsWith("$")
                && rawPassword.equals(storedPassword);

        if (isLegacyPlainText) {
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
        }
    }
}