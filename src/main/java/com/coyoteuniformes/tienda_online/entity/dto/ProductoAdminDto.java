package com.coyoteuniformes.tienda_online.entity.dto;

import java.math.BigDecimal;

public interface ProductoAdminDto {
    Long getIdProducto();
    String getNombre();
    BigDecimal getPrecioBase();
    String getImagenUrl();
    Boolean getActivo();
    Long getIdCategoria();
    String getCategoriaNombre();
    Long getStockTotal();
    String getSkuPrincipal();
}
