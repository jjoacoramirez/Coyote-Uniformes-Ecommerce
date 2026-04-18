package com.coyoteuniformes.tienda_online.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coyoteuniformes.tienda_online.entity.Carrito;
import com.coyoteuniformes.tienda_online.service.CarritoService;

@RestController
@RequestMapping("carritos")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @GetMapping
    public String getAllCarritos() {
        return carritoService.getAllCarritos();
    }

    @GetMapping("/{id}")
    public String getCarritoById(@PathVariable Long id) {
        return carritoService.getCarritoById(id);
    }

    @PostMapping
    public String createCarrito(@RequestBody Carrito carrito) {
        return carritoService.createCarrito(carrito.toString());
    }

    @PutMapping("/{id}")
    public String updateCarrito(@PathVariable Long id, @RequestBody Carrito carrito) {
        return carritoService.updateCarrito(id, carrito.toString());
    }

    @DeleteMapping("/{id}")
    public String deleteCarrito(@PathVariable Long id) {
        return carritoService.deleteCarrito(id);
    }
}
