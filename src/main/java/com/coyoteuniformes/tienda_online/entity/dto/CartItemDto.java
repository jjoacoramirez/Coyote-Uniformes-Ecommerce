package com.coyoteuniformes.tienda_online.entity.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemDto {
    private Long idItemCarrito;
    private Long idVariante;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
    private Long idProducto;
    private String productoNombre;
    private String productoImagenUrl;
    private String categoriaNombre;
    private String talle;
    private String color;
}
