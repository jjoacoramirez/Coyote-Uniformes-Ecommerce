package com.coyoteuniformes.tienda_online.controllers;

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
    public String getAllVariantes() {
        return varianteProductoService.getAllVariantes();
    }

    @GetMapping("/{id}")
    public String getVarianteById(@PathVariable Long id) {
        return varianteProductoService.getVarianteById(id);
    }

    @PostMapping
    public String createVariante(@RequestBody VarianteProducto variante) {
        return varianteProductoService.createVariante(variante.toString());
    }

    @PutMapping("/{id}")
    public String updateVariante(@PathVariable Long id, @RequestBody VarianteProducto variante) {
        return varianteProductoService.updateVariante(id, variante.toString());
    }

    @DeleteMapping("/{id}")
    public String deleteVariante(@PathVariable Long id) {
        return varianteProductoService.deleteVariante(id);
    }
}
