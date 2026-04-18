package com.coyoteuniformes.tienda_online.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VarianteProductoDto {
    private Long idVariante;
    private Long idProducto;
    private String talle;
    private String color;
    private Integer stock;
    private String sku;
    private BigDecimal precio;
    private Boolean activo;
}
