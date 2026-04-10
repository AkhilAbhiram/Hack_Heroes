package com.example.order.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.order.entity.Order;
import com.example.order.entity.Product;
import com.example.order.entity.User;
import com.example.order.service.InventoryService;
import com.example.order.service.OrderService;
import com.example.order.service.ProductService;
import com.example.order.service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final UserService userService;
    private final InventoryService inventoryService;

    public AdminController(ProductService productService,
                           OrderService orderService,
                           UserService userService,
                           InventoryService inventoryService) {
        this.productService = productService;
        this.orderService = orderService;
        this.userService = userService;
        this.inventoryService = inventoryService;
    }


    @PostMapping("/product")
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @PutMapping("/product/{id}")
    public Product updateStock(@PathVariable Long id, @RequestParam int qty) {
        return inventoryService.updateStock(id, qty);
    }

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }


    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/orders/{id}/status")
    public Order updateOrderStatus(@PathVariable Long id,
                        @RequestParam String status) {
        return orderService.updateStatus(id, status);
    }


    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}