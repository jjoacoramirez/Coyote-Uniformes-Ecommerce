package com.coyoteuniformes.tienda_online.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.coyoteuniformes.tienda_online.entity.dto.VarianteProductoDto;
import com.coyoteuniformes.tienda_online.service.VarianteProductoService;

@RestController
@RequestMapping("variantes")
public class VarianteProductoController {

    private final VarianteProductoService varianteProductoService;

    VarianteProductoController(VarianteProductoService varianteProductoService) {
        this.varianteProductoService = varianteProductoService;
    }

    @GetMapping
    public ResponseEntity<List<VarianteProductoDto>> getAllVariantes() {
        return ResponseEntity.ok(varianteProductoService.getAllVariantes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VarianteProductoDto> getVarianteById(@PathVariable Long id) {
        return varianteProductoService.getVarianteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<VarianteProductoDto> createVariante(@RequestBody VarianteProductoDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(varianteProductoService.createVariante(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VarianteProductoDto> updateVariante(@PathVariable Long id, @RequestBody VarianteProductoDto dto) {
        return ResponseEntity.ok(varianteProductoService.updateVariante(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVariante(@PathVariable Long id) {
        varianteProductoService.deleteVariante(id);
        return ResponseEntity.noContent().build();
    }
}
