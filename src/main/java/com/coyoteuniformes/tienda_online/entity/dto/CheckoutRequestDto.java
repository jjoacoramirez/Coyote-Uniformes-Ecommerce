package com.coyoteuniformes.tienda_online.entity.dto;

import lombok.Data;

@Data
public class CheckoutRequestDto {
    private String metodoPago;
    // Código de cupón aplicado (opcional).
    private String codigoDescuento;
}
