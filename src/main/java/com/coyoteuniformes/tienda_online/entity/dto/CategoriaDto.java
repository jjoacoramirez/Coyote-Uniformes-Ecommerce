package com.coyoteuniformes.tienda_online.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaDto {
    private Long idCategoria;
    private String nombre;
    private String descripcion;
}
