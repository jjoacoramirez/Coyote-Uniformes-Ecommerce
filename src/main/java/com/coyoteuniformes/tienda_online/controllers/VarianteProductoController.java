package com.coyoteuniformes.tienda_online.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coyoteuniformes.tienda_online.entity.VarianteProducto;
import com.coyoteuniformes.tienda_online.service.VarianteProductoService;

@RestController
@RequestMapping("variantes")
public class VarianteProductoController {

    @Autowired
    private VarianteProductoService varianteProductoService;

    @GetMapping
    public List<VarianteProducto> getAllVariantes() {
        return varianteProductoService.getAllVariantes();
    }

    @GetMapping("/{id}")
    public Optional<VarianteProducto> getVarianteById(@PathVariable Long id) {
        return varianteProductoService.getVarianteById(id);
    }

    @PostMapping
    public VarianteProducto createVariante(@RequestBody VarianteProducto variante) {
        return varianteProductoService.createVariante(variante);
    }

    @PutMapping("/{id}")
    public VarianteProducto updateVariante(@PathVariable Long id, @RequestBody VarianteProducto variante) {
        return varianteProductoService.updateVariante(id, variante);
    }

    @DeleteMapping("/{id}")
    public String deleteVariante(@PathVariable Long id) {
        try {
            varianteProductoService.deleteVariante(id);
            return "Variante eliminada correctamente";
        } catch (Exception ex) {
            return "No se pudo eliminar la variante: " + ex.getMessage();
        }
    }
}
