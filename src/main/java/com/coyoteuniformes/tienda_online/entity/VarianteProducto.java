package com.coyoteuniformes.tienda_online.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "variantes_producto")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VarianteProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idVariante;
    private Long idProducto;
    private String talle;
    private String color;
    private Integer stock;
    private String sku;
    private BigDecimal precio;
    private Boolean activo;
}
