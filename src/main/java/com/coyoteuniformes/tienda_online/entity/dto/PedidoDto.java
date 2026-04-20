package com.coyoteuniformes.tienda_online.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class PedidoDto {
    private Long idPedido;
    @NotNull(message = "El id del cliente es obligatorio")
    private Long idCliente;
    private LocalDate fechaPedido;
    @NotBlank(message = "El estado del pedido es obligatorio")
    private String estado;
    @NotNull(message = "El total del pedido es obligatorio")
    private BigDecimal total;
}
