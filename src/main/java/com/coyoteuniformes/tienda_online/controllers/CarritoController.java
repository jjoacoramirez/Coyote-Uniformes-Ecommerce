package com.coyoteuniformes.tienda_online.controllers;

import java.util.List;
import java.util.Optional;
import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coyoteuniformes.tienda_online.entity.Carrito;
import com.coyoteuniformes.tienda_online.entity.dto.CartDto;
import com.coyoteuniformes.tienda_online.entity.dto.CartItemRequestDto;
import com.coyoteuniformes.tienda_online.entity.dto.CheckoutRequestDto;
import com.coyoteuniformes.tienda_online.entity.dto.CheckoutResponseDto;
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

    @GetMapping("/me")
    public CartDto getCarritoActual(Principal principal) {
        return carritoService.getCarritoActual(principal.getName());
    }

    @PostMapping("/me/items")
    public CartDto agregarItem(Principal principal, @RequestBody CartItemRequestDto request) {
        return carritoService.agregarItem(principal.getName(), request);
    }

    @PutMapping("/me/items/{idItem}")
    public CartDto actualizarItem(
            Principal principal,
            @PathVariable Long idItem,
            @RequestBody CartItemRequestDto request
    ) {
        return carritoService.actualizarItem(principal.getName(), idItem, request);
    }

    @DeleteMapping("/me/items/{idItem}")
    public CartDto eliminarItem(Principal principal, @PathVariable Long idItem) {
        return carritoService.eliminarItem(principal.getName(), idItem);
    }

    @DeleteMapping("/me")
    public CartDto vaciarCarritoActual(Principal principal) {
        return carritoService.vaciarCarritoActual(principal.getName());
    }

    @PostMapping("/me/checkout")
    public CheckoutResponseDto checkout(Principal principal, @RequestBody CheckoutRequestDto request) {
        return carritoService.checkout(principal.getName(), request);
    }
}
