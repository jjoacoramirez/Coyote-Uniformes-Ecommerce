package com.coyoteuniformes.tienda_online.entity.dto;

import lombok.Data;

@Data
public class CartItemRequestDto {
    private Long idVariante;
    private Integer cantidad;
}
