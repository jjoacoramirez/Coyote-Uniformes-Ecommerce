package com.coyoteuniformes.tienda_online.service;

public interface ICategoriaService {
    String getAllCategorias();
    String getCategoriaById(Long id);
    String createCategoria(String categoria);
    String updateCategoria(Long id, String categoria);
    String deleteCategoria(Long id);
}
