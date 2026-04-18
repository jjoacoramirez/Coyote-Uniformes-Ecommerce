package com.coyoteuniformes.tienda_online.service;

public interface IItemCarritoService {
    String getAllItemsCarrito();
    String getItemCarritoById(Long id);
    String createItemCarrito(String itemCarrito);
    String updateItemCarrito(Long id, String itemCarrito);
    String deleteItemCarrito(Long id);
}
