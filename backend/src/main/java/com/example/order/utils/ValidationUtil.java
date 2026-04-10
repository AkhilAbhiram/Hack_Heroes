package com.example.order.utils;

public class ValidationUtil {

    public static boolean isValidPhone(String phone) {
        return phone != null && phone.matches("^[0-9]{10}$");
    }

    public static boolean isValidEmail(String email) {
        return email != null && email.contains("@");
    }

    public static boolean isPositiveNumber(int number) {
        return number > 0;
    }
}