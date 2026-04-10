package com.example.order.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.order.entity.Product;
import com.example.order.repository.ProductRepository;

@Service
public class CartService {

    private final ProductRepository productRepository;
    private final List<Product> cart = new ArrayList<>();

    public CartService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public void addToCart(Long productId) {
        productRepository.findById(productId).ifPresent(cart::add);
    }

    public List<Product> getCartItems() {
        return cart;
    }

    public void clearCart() {
        cart.clear();
    }
}