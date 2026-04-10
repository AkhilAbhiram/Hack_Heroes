package com.example.order.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private String name;
    private String description;
    private String category;
    private Double price;
    private Integer stock;
}