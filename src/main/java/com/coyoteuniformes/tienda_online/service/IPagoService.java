package com.coyoteuniformes.tienda_online.service;

public interface IPagoService {
    String getAllPagos();
    String getPagoById(Long id);
    String createPago(String pago);
    String updatePago(Long id, String pago);
    String deletePago(Long id);
}
