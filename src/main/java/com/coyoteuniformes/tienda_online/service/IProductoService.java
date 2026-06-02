package com.coyoteuniformes.tienda_online.service;

import java.util.List;
import java.util.Optional;

import com.coyoteuniformes.tienda_online.entity.dto.ProductoDto;

public interface IProductoService {
    List<ProductoDto> getAllProductos();
    Optional<ProductoDto> getProductoById(Long id);
    ProductoDto createProducto(ProductoDto dto);
    ProductoDto updateProducto(Long id, ProductoDto dto);
    void deleteProducto(Long id);
}
