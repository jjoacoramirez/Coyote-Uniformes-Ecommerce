package com.coyoteuniformes.tienda_online.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PagoDto {
    private Long idPago;
    private Long idPedido;
    private LocalDate fechaPago;
    private BigDecimal monto;
    private String metodoPago;
    private String estadoPago;
}
