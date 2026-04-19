package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Pago;
import java.util.List;
import java.util.Optional;

public interface IPagoService {
    List<Pago> getAllPagos();
    Optional<Pago> getPagoById(Long id);
    Pago createPago(Pago pago);
    Pago updatePago(Long id, Pago pago);
    void deletePago(Long id);
}
