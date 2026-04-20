package com.coyoteuniformes.tienda_online.service;

import java.util.List;
import java.util.Optional;

import com.coyoteuniformes.tienda_online.entity.Producto;

public interface IProductoService {
    List<Producto> getAllProductos();

    Optional<Producto> getProductoById(Long id);

    Producto updateProducto(Long id, Producto producto);

    Producto createProducto(Producto producto);

    void deleteProducto(Long id);
}
