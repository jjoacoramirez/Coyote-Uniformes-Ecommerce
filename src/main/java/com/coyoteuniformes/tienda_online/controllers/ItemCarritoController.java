package com.coyoteuniformes.tienda_online.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coyoteuniformes.tienda_online.entity.ItemCarrito;
import com.coyoteuniformes.tienda_online.service.ItemCarritoService;

@RestController
@RequestMapping("items-carrito")
public class ItemCarritoController {

    @Autowired
    private ItemCarritoService itemCarritoService;

    @GetMapping
    public List<ItemCarrito> getAllItemsCarrito() {
        return itemCarritoService.getAllItemsCarrito();
    }

    @GetMapping("/{id}")
    public Optional<ItemCarrito> getItemCarritoById(@PathVariable Long id) {
        return itemCarritoService.getItemCarritoById(id);
    }

    @PostMapping
    public ItemCarrito createItemCarrito(@RequestBody ItemCarrito itemCarrito) {
        return itemCarritoService.createItemCarrito(itemCarrito);
    }

    @PutMapping("/{id}")
    public ItemCarrito updateItemCarrito(@PathVariable Long id, @RequestBody ItemCarrito itemCarrito) {
        return itemCarritoService.updateItemCarrito(id, itemCarrito);
    }

    @DeleteMapping("/{id}")
    public String deleteItemCarrito(@PathVariable Long id) {
        itemCarritoService.deleteItemCarrito(id);
        return "Item de carrito eliminado correctamente";
    }
}
