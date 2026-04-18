package com.coyoteuniformes.tienda_online.service;

public interface IVarianteProductoService {
    String getAllVariantes();
    String getVarianteById(Long id);
    String createVariante(String variante);
    String updateVariante(Long id, String variante);
    String deleteVariante(Long id);
}
