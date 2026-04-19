package com.coyoteuniformes.tienda_online.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.coyoteuniformes.tienda_online.entity.Categoria;
import com.coyoteuniformes.tienda_online.repository.CategoriaRepository;

@Service
public class CategoriaService implements ICategoriaService {
    private final CategoriaRepository categoriaRepository;

    CategoriaService(CategoriaRepository categoriaRepository){
        this.categoriaRepository = categoriaRepository;
    }

    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll(); 
    }

    public Categoria getCategoriaById(Long id) {
        return categoriaRepository.findById(id).orElse(null);
    }

    public Categoria createCategoria(Categoria categoria) {
        return categoriaRepository.save(categoria);
    }

    public Categoria updateCategoria(Long id, Categoria categoria) {
        Categoria existente = categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

        existente.setNombre(categoria.getNombre());
        existente.setDescripcion(categoria.getDescripcion());

        return categoriaRepository.save(existente);

    }

    public String deleteCategoria(Long id) {
        try {
            categoriaRepository.deleteById(id);
            return "Categoria eliminada correctamente";
        } catch (Exception ex) {
            return "No se pudo eliminar la categoria: " + ex.getMessage();
        }
    }
}
