package com.coyoteuniformes.tienda_online.controllers;

import com.coyoteuniformes.tienda_online.entity.Descuento;
import com.coyoteuniformes.tienda_online.entity.dto.DescuentoDto;
import com.coyoteuniformes.tienda_online.service.DescuentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("descuentos")
@RequiredArgsConstructor
public class DescuentoController {

    private final DescuentoService descuentoService;

    @GetMapping
    public List<Descuento> getAllDescuentos() {
        return descuentoService.getAllDescuentos();
    }

    @GetMapping("/{id}")
    public Descuento getDescuentoById(@PathVariable Long id) {
        return descuentoService.getDescuentoById(id);
    }

    /** Endpoint público para validar un cupón desde el frontend */
    @GetMapping("/validar/{codigo}")
    public ResponseEntity<Descuento> validarDescuento(@PathVariable String codigo) {
        Descuento descuento = descuentoService.validarDescuento(codigo);
        return ResponseEntity.ok(descuento);
    }

    @PostMapping
    public ResponseEntity<Descuento> createDescuento(@RequestBody DescuentoDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(descuentoService.createDescuento(dto));
    }

    @PutMapping("/{id}")
    public Descuento updateDescuento(@PathVariable Long id, @RequestBody DescuentoDto dto) {
        return descuentoService.updateDescuento(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDescuento(@PathVariable Long id) {
        descuentoService.deleteDescuento(id);
        return ResponseEntity.noContent().build();
    }
}
