package com.jangombe.jangombe_backend.controller;

import com.jangombe.jangombe_backend.dto.UserResponse;
import com.jangombe.jangombe_backend.dto.TeacherCreateRequest;
import com.jangombe.jangombe_backend.entity.User;
import com.jangombe.jangombe_backend.service.TeacherService;
import com.jangombe.jangombe_backend.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class AuthController {

    private final UserService userService;
    private final TeacherService teacherService;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(
            UserService userService,
            TeacherService teacherService,
            SecurityContextRepository securityContextRepository) {
        this.userService = userService;
        this.teacherService = teacherService;
        this.securityContextRepository = securityContextRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse) {

        User user = userService.findByUsername(request.getUsername())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid username or password");
        }

        if (!userService.isPasswordValid(
                request.getPassword(),
                user.getPassword())) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid username or password");
        }

        userService.upgradeLegacyPassword(user, request.getPassword());

        var authentication = new UsernamePasswordAuthenticationToken(
                user.getUsername(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);

        return ResponseEntity.ok(
            new UserResponse(user, teacherService.findByEmail(user.getUsername()).orElse(null))
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        TeacherCreateRequest teacherRequest = new TeacherCreateRequest();
        teacherRequest.setFirstName(request.getFirstName().trim());
        teacherRequest.setLastName(request.getLastName().trim());
        teacherRequest.setEmail(request.getEmail().trim().toLowerCase(Locale.ROOT));
        teacherRequest.setPhone(request.getPhone());
        teacherRequest.setPassword(request.getPassword());

        try {
            var teacher = teacherService.createTeacher(teacherRequest);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new UserResponse(teacher.getUser(), teacher));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        SecurityContextHolder.clearContext();
        if (request.getSession(false) != null) {
            request.getSession(false).invalidate();
        }
        return ResponseEntity.noContent().build();
    }

    public static class LoginRequest {

        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class RegisterRequest {

        @NotBlank
        @Size(max = 100)
        private String firstName;

        @NotBlank
        @Size(max = 100)
        private String lastName;

        @NotBlank
        @Email
        @Pattern(regexp = "(?i)^[A-Z0-9._%+-]+@gmail\\.com$")
        @Size(max = 50)
        private String email;

        @Size(max = 30)
        private String phone;

        @NotBlank
        @Size(min = 8, max = 72)
        @Pattern(regexp = ".*[A-Z].*")
        private String password;

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}