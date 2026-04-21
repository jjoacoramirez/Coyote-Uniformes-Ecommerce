package com.coyoteuniformes.tienda_online.controllers;

import java.util.List;
import java.util.Optional;

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
    public List<Carrito> getAllCarritos() {
        return carritoService.getAllCarritos();
    }

    @GetMapping("/{id}")
    public Optional<Carrito> getCarritoById(@PathVariable Long id) {
        return carritoService.getCarritoById(id);
    }

    @PostMapping
    public Carrito createCarrito(@RequestBody Carrito carrito) {
        return carritoService.createCarrito(carrito);
    }

    @PutMapping("/{id}")
    public Carrito updateCarrito(@PathVariable Long id, @RequestBody Carrito carrito) {
        return carritoService.updateCarrito(id, carrito);
    }

    @DeleteMapping("/{id}")
    public String deleteCarrito(@PathVariable Long id) {
        carritoService.deleteCarrito(id);
        return "Carrito eliminado correctamente";
    }
}
