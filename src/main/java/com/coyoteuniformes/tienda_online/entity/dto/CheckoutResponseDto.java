package com.coyoteuniformes.tienda_online.entity.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckoutResponseDto {
    private Long idPedido;
    private Long idPago;
    private String estadoPedido;
    private String estadoPago;
    private BigDecimal total;
}
