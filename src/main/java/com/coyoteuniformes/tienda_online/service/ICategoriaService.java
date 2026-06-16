package com.coyoteuniformes.tienda_online.service;

import java.util.List;

import com.coyoteuniformes.tienda_online.entity.Categoria;
import com.coyoteuniformes.tienda_online.entity.dto.CategoriaAdminDto;

public interface ICategoriaService {
    List<Categoria> getAllCategorias();
    List<CategoriaAdminDto> getCategoriasAdmin();
    Categoria getCategoriaById(Long id);
    Categoria createCategoria(Categoria categoria);
    Categoria updateCategoria(Long id, Categoria categoria);
    void deleteCategoria(Long id);
}
