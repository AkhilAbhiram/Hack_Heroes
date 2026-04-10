package com.example.order.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.order.dto.LoginRequest;
import com.example.order.entity.User;
import com.example.order.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/login")
public User login(@RequestBody LoginRequest request) {
    return authService.login(request.getEmail(), request.getPassword());
}


    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }
}