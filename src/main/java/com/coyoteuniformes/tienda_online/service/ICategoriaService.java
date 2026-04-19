package com.coyoteuniformes.tienda_online.service;

import java.util.List;

import com.coyoteuniformes.tienda_online.entity.Categoria;

public interface ICategoriaService {
    List<Categoria> getAllCategorias();
    Categoria getCategoriaById(Long id);
    Categoria createCategoria(Categoria categoria);
    Categoria updateCategoria(Long id, Categoria categoria);
    String deleteCategoria(Long id);
}
