package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.repository.ProductoRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.coyoteuniformes.tienda_online.entity.Producto;

@Service
public class ProductoService implements IProductoService {
    
    private final ProductoRepository productoRepository;

    ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public List<Producto> getAllProductos() {
        //productorepo.findAll();
        return productoRepository.findAll();
    }

    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
    }

    public Producto updateProducto(Long id, Producto producto) {
        Producto existente = productoRepository.findById(id).orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        existente.setCategoria(producto.getCategoria());
        existente.setNombre(producto.getNombre());
        existente.setDescripcion(producto.getDescripcion());
        existente.setPrecioBase(producto.getPrecioBase());
        existente.setImagenUrl(producto.getImagenUrl());
        existente.setActivo(producto.getActivo());

        
        return productoRepository.save(existente);
    }

    public Producto createProducto(Producto producto) {
        
        return productoRepository.save(producto);
    }

    public void deleteProducto(Long id) {
        productoRepository.deleteById(id);
    }
}
