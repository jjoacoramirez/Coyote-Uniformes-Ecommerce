package com.coyoteuniformes.tienda_online.service;

import org.springframework.stereotype.Service;

@Service
public class ProductoService implements IProductoService {
    
    public String getAllProductos() {
        //productorepo.findAll();
        return "List of all products";
    }

    public String getProductoById(Long id) {
        return "Details of product with ID: " + id;
    }

    public String updateProducto(Long id, String producto) {
        return "Updated product with ID: " + id;
    }

    public String createProducto(String producto) {
        return "Created new product";
    }

    public String deleteProducto(Long id) {
        return "Deleted product with ID: " + id;
    }
}
