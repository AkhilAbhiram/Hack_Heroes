package com.example.order.service;

import org.springframework.stereotype.Service;

import com.example.order.entity.Payment;
import com.example.order.repository.PaymentRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment processPayment(Payment payment) {
        payment.setPaymentStatus("SUCCESS");
        return paymentRepository.save(payment);
    }
}