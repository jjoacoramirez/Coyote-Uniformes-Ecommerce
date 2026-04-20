package com.coyoteuniformes.tienda_online.controllers;

import java.util.List;
import java.util.Optional;

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
    public List<Producto> getAllProductos() {
        List<Producto> result = productoService.getAllProductos();
        return result;
    }

    @GetMapping("/{id}")
    public Optional<Producto> getProductoById(@PathVariable Long id) {
        Optional<Producto> result = productoService.getProductoById(id);
        return result;
    }

    @PutMapping("/{id}")
    public String updateProducto(@PathVariable Long id, @RequestBody Producto producto) {
        return "Updated product with ID: " + id;
    }

    @PostMapping
    public Producto createProducto(@RequestBody Producto producto) {
        var result = productoService.createProducto(producto);
        return result;
    }

    @DeleteMapping("/{id}")
    public String deleteProducto(@PathVariable Long id) {
        try {
            productoService.deleteProducto(id);
            return "Producto eliminado correctamente";
        } catch (Exception ex) {
            return "No se pudo eliminar el producto: " + ex.getMessage();
        }
    }

}
