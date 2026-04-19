package com.coyoteuniformes.tienda_online.controllers;

import com.coyoteuniformes.tienda_online.entity.dto.AdministradorDto;
import com.coyoteuniformes.tienda_online.service.AdministradorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("administradores")
public class AdministradorController {

    private final AdministradorService administradorService;

    public AdministradorController(AdministradorService administradorService) {
        this.administradorService = administradorService;
    }

    @GetMapping
    public ResponseEntity<List<AdministradorDto>> getAllAdministradores() {
        return ResponseEntity.ok(administradorService.getAllAdministradores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdministradorDto> getAdministradorById(@PathVariable Long id) {
        return ResponseEntity.ok(administradorService.getAdministradorById(id));
    }

    @PostMapping
    public ResponseEntity<AdministradorDto> createAdministrador(@Valid @RequestBody AdministradorDto administradorDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(administradorService.createAdministrador(administradorDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdministradorDto> updateAdministrador(@PathVariable Long id, @Valid @RequestBody AdministradorDto administradorDto) {
        return ResponseEntity.ok(administradorService.updateAdministrador(id, administradorDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdministrador(@PathVariable Long id) {
        administradorService.deleteAdministrador(id);
        return ResponseEntity.noContent().build();
    }
}
