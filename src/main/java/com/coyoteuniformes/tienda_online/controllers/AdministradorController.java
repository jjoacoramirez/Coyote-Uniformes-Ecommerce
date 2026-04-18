package com.coyoteuniformes.tienda_online.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coyoteuniformes.tienda_online.entity.Administrador;
import com.coyoteuniformes.tienda_online.service.AdministradorService;

@RestController
@RequestMapping("administradores")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    @GetMapping
    public String getAllAdministradores() {
        return administradorService.getAllAdministradores();
    }

    @GetMapping("/{id}")
    public String getAdministradorById(@PathVariable Long id) {
        return administradorService.getAdministradorById(id);
    }

    @PostMapping
    public String createAdministrador(@RequestBody Administrador administrador) {
        return administradorService.createAdministrador(administrador.toString());
    }

    @PutMapping("/{id}")
    public String updateAdministrador(@PathVariable Long id, @RequestBody Administrador administrador) {
        return administradorService.updateAdministrador(id, administrador.toString());
    }

    @DeleteMapping("/{id}")
    public String deleteAdministrador(@PathVariable Long id) {
        return administradorService.deleteAdministrador(id);
    }
}
