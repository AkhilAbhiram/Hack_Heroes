package com.example.order.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.order.entity.Product;
public interface ProductRepository extends JpaRepository<Product, Long> {
    
}
