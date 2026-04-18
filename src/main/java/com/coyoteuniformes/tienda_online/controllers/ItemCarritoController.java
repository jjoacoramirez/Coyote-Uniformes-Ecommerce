package com.coyoteuniformes.tienda_online.controllers;

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
    public String getAllItemsCarrito() {
        return itemCarritoService.getAllItemsCarrito();
    }

    @GetMapping("/{id}")
    public String getItemCarritoById(@PathVariable Long id) {
        return itemCarritoService.getItemCarritoById(id);
    }

    @PostMapping
    public String createItemCarrito(@RequestBody ItemCarrito itemCarrito) {
        return itemCarritoService.createItemCarrito(itemCarrito.toString());
    }

    @PutMapping("/{id}")
    public String updateItemCarrito(@PathVariable Long id, @RequestBody ItemCarrito itemCarrito) {
        return itemCarritoService.updateItemCarrito(id, itemCarrito.toString());
    }

    @DeleteMapping("/{id}")
    public String deleteItemCarrito(@PathVariable Long id) {
        return itemCarritoService.deleteItemCarrito(id);
    }
}
