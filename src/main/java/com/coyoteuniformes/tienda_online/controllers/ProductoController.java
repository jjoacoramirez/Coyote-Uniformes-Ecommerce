package com.coyoteuniformes.tienda_online.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coyoteuniformes.tienda_online.entity.Producto;
import com.coyoteuniformes.tienda_online.service.ProductoService;

@RestController
@RequestMapping("productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public String getAllProductos() {
        var result = productoService.getAllProductos();
        return result;
    }

    @GetMapping("/{id}")
    public String getProductoById(@PathVariable Long id) {
        return "Details of product with ID: " + id;
    }

    @PutMapping("/{id}")
    public String updateProducto(@PathVariable Long id, @RequestBody Producto producto) {
        return "Updated product with ID: " + id;
    }

    @PostMapping
    public String createProducto(@RequestBody Producto producto) {
        var result = productoService.createProducto(producto.toString());
        return result;
    }

    @DeleteMapping("/{id}")
    public String deleteProducto(@PathVariable Long id) {
        var result = productoService.deleteProducto(id);
        return result;
    }

}
