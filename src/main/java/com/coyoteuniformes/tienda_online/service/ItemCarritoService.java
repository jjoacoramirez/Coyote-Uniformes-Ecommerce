package com.coyoteuniformes.tienda_online.service;

import org.springframework.stereotype.Service;

@Service
public class ItemCarritoService implements IItemCarritoService {

    public String getAllItemsCarrito() { return "Lista de items del carrito"; }
    public String getItemCarritoById(Long id) { return "Item carrito con ID: " + id; }
    public String createItemCarrito(String itemCarrito) { return "Item carrito creado"; }
    public String updateItemCarrito(Long id, String itemCarrito) { return "Item carrito actualizado con ID: " + id; }
    public String deleteItemCarrito(Long id) { return "Item carrito eliminado con ID: " + id; }
}
