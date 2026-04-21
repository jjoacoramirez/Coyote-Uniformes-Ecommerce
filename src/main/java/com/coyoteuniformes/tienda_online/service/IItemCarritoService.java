package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.ItemCarrito;

import java.util.List;
import java.util.Optional;

public interface IItemCarritoService {
    List<ItemCarrito> getAllItemsCarrito();

    Optional<ItemCarrito> getItemCarritoById(Long id);

    ItemCarrito createItemCarrito(ItemCarrito itemCarrito);

    ItemCarrito updateItemCarrito(Long id, ItemCarrito itemCarrito);

    void deleteItemCarrito(Long id);
}
