package com.jangombe.jangombe_backend.controller;

import com.jangombe.jangombe_backend.dto.UserResponse;
import com.jangombe.jangombe_backend.entity.User;
import com.jangombe.jangombe_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> createUser(
            @RequestBody User user) {

        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().build();
        }

        User savedUser = userService.createUser(user);

        return ResponseEntity.ok(
                new UserResponse(savedUser)
        );
    }

    @GetMapping("/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable String username) {

        return userService.findByUsername(username)
                .map(user -> ResponseEntity.ok(
                        new UserResponse(user)
                ))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}