package com.coyoteuniformes.tienda_online.service;

import org.springframework.stereotype.Service;

@Service
public class PagoService implements IPagoService {

    public String getAllPagos() { return "Lista de pagos"; }
    public String getPagoById(Long id) { return "Pago con ID: " + id; }
    public String createPago(String pago) { return "Pago creado"; }
    public String updatePago(Long id, String pago) { return "Pago actualizado con ID: " + id; }
    public String deletePago(Long id) { return "Pago eliminado con ID: " + id; }
}
