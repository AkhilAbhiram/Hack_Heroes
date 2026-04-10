package com.example.order.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.order.entity.Order;
import com.example.order.entity.OrderItem;
import com.example.order.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

   public Order createOrder(Order order) {

    double total = 0;

    for (OrderItem item : order.getOrderItems()) {
        item.setOrder(order);
        total += item.getPrice() * item.getQuantity();
    }

    order.setTotalAmount(total);
    order.setStatus("PLACED");
    order.setPaymentStatus("PENDING");

    return orderRepository.save(order);
}

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order updateStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
}