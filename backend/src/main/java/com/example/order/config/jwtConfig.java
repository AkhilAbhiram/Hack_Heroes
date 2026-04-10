package com.example.order.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class jwtConfig {

    public static final String SECRET = "mysecretkey";
    public static final long EXPIRATION_TIME = 86400000; 
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
}