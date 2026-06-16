package com.coyoteuniformes.tienda_online.entity.dto;

import com.coyoteuniformes.tienda_online.entity.TipoDescuento;
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
public class DescuentoDto {
    private Long idDescuento;
    private String codigo;
    private TipoDescuento tipo;
    private BigDecimal valor;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Boolean activo;
    private Integer usoMaximo;
    private Integer usoActual;
    private BigDecimal montoMinimo;
}
