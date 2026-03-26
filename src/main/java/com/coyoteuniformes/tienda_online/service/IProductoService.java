package com.coyoteuniformes.tienda_online.service;

public interface IProductoService {
    String getAllProductos();

    String getProductoById(Long id);

    String updateProducto(Long id, String producto);

    String createProducto(String producto);

    String deleteProducto(Long id);
}
