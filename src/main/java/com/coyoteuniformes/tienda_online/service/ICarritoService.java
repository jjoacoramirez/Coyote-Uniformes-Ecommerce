package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Carrito;

import java.util.List;
import java.util.Optional;

public interface ICarritoService {
    List<Carrito> getAllCarritos();

    Optional<Carrito> getCarritoById(Long id);

    Carrito createCarrito(Carrito carrito);

    Carrito updateCarrito(Long id, Carrito carrito);

    void deleteCarrito(Long id);
}
