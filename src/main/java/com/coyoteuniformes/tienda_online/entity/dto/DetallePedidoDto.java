package com.coyoteuniformes.tienda_online.entity.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetallePedidoDto {

    private Long idDetallePedido;
    @NotNull(message = "El id del pedido es obligatorio")
    private Long idPedido;
    @NotNull(message = "El id de la variante es obligatorio")
    private Long idVariante;
    @NotNull(message = "La cantidad es obligatoria")
    @Positive(message = "La cantidad debe ser mayor a cero")
    private Integer cantidad;
    @NotNull(message = "El precio unitario es obligatorio")
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}
