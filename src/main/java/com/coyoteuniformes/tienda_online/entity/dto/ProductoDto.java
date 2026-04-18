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
public class ProductoDto {
    private Long idProducto;
    private Long idCategoria;
    private String nombre;
    private String descripcion;
    private BigDecimal precioBase;
    private String imagenUrl;
    private Boolean activo;
}
