package com.coyoteuniformes.tienda_online.service;

import org.springframework.stereotype.Service;

@Service
public class AdministradorService implements IAdministradorService {

    public String getAllAdministradores() { return "Lista de administradores"; }
    public String getAdministradorById(Long id) { return "Administrador con ID: " + id; }
    public String createAdministrador(String administrador) { return "Administrador creado"; }
    public String updateAdministrador(Long id, String administrador) { return "Administrador actualizado con ID: " + id; }
    public String deleteAdministrador(Long id) { return "Administrador eliminado con ID: " + id; }
}
