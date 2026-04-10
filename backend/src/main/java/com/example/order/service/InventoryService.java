package com.example.order.service;

import org.springframework.stereotype.Service;

import com.example.order.entity.Product;
import com.example.order.repository.ProductRepository;

@Service
public class InventoryService {

    private final ProductRepository productRepository;

    public InventoryService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product updateStock(Long id, int qty) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setStock(qty);
        return productRepository.save(product);
    }
}
