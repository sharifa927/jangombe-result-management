package com.jangombe.jangombe_backend.dto;

import com.jangombe.jangombe_backend.entity.User;
import com.jangombe.jangombe_backend.entity.Teacher;

public class UserResponse {

    private Long id;
    private String username;
    private String role;
    private Long teacherId;
    private String firstName;
    private String lastName;

    public UserResponse(User user) {
        this(user, null);
    }

    public UserResponse(User user, Teacher teacher) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.role = user.getRole();
        if (teacher != null) {
            this.teacherId = teacher.getId();
            this.firstName = teacher.getFirstName();
            this.lastName = teacher.getLastName();
        }
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
}