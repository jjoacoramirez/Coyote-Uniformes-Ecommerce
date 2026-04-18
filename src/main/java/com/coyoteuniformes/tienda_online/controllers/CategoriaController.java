package com.coyoteuniformes.tienda_online.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coyoteuniformes.tienda_online.entity.Categoria;
import com.coyoteuniformes.tienda_online.service.CategoriaService;

@RestController
@RequestMapping("categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public String getAllCategorias() {
        return categoriaService.getAllCategorias();
    }

    @GetMapping("/{id}")
    public String getCategoriaById(@PathVariable Long id) {
        return categoriaService.getCategoriaById(id);
    }

    @PostMapping
    public String createCategoria(@RequestBody Categoria categoria) {
        return categoriaService.createCategoria(categoria.toString());
    }

    @PutMapping("/{id}")
    public String updateCategoria(@PathVariable Long id, @RequestBody Categoria categoria) {
        return categoriaService.updateCategoria(id, categoria.toString());
    }

    @DeleteMapping("/{id}")
    public String deleteCategoria(@PathVariable Long id) {
        return categoriaService.deleteCategoria(id);
    }
}
