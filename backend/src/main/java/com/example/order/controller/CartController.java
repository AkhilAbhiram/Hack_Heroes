package com.example.order.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.order.entity.Product;
import com.example.order.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add/{productId}")
    public void addToCart(@PathVariable Long productId) {
        cartService.addToCart(productId);
    }

    @GetMapping
    public List<Product> getCart() {
        return cartService.getCartItems();
    }

    @DeleteMapping("/clear")
    public void clearCart() {
        cartService.clearCart();
    }
}