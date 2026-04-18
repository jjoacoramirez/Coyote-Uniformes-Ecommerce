package com.coyoteuniformes.tienda_online.service;

import org.springframework.stereotype.Service;

@Service
public class CarritoService implements ICarritoService {

    public String getAllCarritos() { return "Lista de carritos"; }
    public String getCarritoById(Long id) { return "Carrito con ID: " + id; }
    public String createCarrito(String carrito) { return "Carrito creado"; }
    public String updateCarrito(Long id, String carrito) { return "Carrito actualizado con ID: " + id; }
    public String deleteCarrito(Long id) { return "Carrito eliminado con ID: " + id; }
}
