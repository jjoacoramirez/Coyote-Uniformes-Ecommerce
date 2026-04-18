package com.coyoteuniformes.tienda_online.service;

import org.springframework.stereotype.Service;

@Service
public class CategoriaService implements ICategoriaService {

    public String getAllCategorias() { return "Lista de categorias"; }
    public String getCategoriaById(Long id) { return "Categoria con ID: " + id; }
    public String createCategoria(String categoria) { return "Categoria creada"; }
    public String updateCategoria(Long id, String categoria) { return "Categoria actualizada con ID: " + id; }
    public String deleteCategoria(Long id) { return "Categoria eliminada con ID: " + id; }
}
