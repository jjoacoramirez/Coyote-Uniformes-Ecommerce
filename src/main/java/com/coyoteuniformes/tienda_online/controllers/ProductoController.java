package com.coyoteuniformes.tienda_online.controllers;

import com.coyoteuniformes.tienda_online.entity.Producto;
import com.coyoteuniformes.tienda_online.entity.dto.ProductoDto;
import com.coyoteuniformes.tienda_online.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    @GetMapping("/{id}")
    public Optional<Producto> getProductoById(@PathVariable Long id) {
        return productoService.getProductoById(id);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Producto> createProducto(
        @RequestPart("producto") ProductoDto dto,
        @RequestPart(value = "imagen", required = false) MultipartFile imagen
    ) throws IOException {
        Producto producto = productoService.createProducto(dto, imagen);
        return ResponseEntity.status(HttpStatus.CREATED).body(producto);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Producto> updateProducto(
        @PathVariable Long id,
        @RequestPart("producto") ProductoDto dto,
        @RequestPart(value = "imagen", required = false) MultipartFile imagen
    ) throws IOException {
        Producto producto = productoService.updateProducto(id, dto, imagen);
        return ResponseEntity.ok(producto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) throws IOException {
        productoService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }
}
