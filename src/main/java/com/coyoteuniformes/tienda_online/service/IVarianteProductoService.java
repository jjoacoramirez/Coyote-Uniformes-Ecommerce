package com.coyoteuniformes.tienda_online.service;

import java.util.List;
import java.util.Optional;

import com.coyoteuniformes.tienda_online.entity.VarianteProducto;

public interface IVarianteProductoService {
    List<VarianteProducto> getAllVariantes();
    List<VarianteProducto> getVariantesByProductoId(Long idProducto);
    Optional<VarianteProducto> getVarianteById(Long id);
    VarianteProducto createVariante(VarianteProducto variante);
    VarianteProducto updateVariante(Long id, VarianteProducto variante);
    void deleteVariante(Long id);
}
