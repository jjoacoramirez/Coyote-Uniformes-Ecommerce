package com.coyoteuniformes.tienda_online.entity.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartDto {
    private Long idCarrito;
    private String estado;
    private LocalDate fechaCreacion;
    private List<CartItemDto> items;
    private Integer totalItems;
    private BigDecimal subtotal;
}
