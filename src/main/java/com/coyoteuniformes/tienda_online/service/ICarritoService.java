package com.coyoteuniformes.tienda_online.service;

public interface ICarritoService {
    String getAllCarritos();
    String getCarritoById(Long id);
    String createCarrito(String carrito);
    String updateCarrito(Long id, String carrito);
    String deleteCarrito(Long id);
}
