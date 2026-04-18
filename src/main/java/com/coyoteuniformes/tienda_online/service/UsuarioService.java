package com.coyoteuniformes.tienda_online.service;

import org.springframework.stereotype.Service;

@Service
public class UsuarioService implements IUsuarioService {

    public String getAllUsuarios() { return "Lista de usuarios"; }
    public String getUsuarioById(Long id) { return "Usuario con ID: " + id; }
    public String createUsuario(String usuario) { return "Usuario creado"; }
    public String updateUsuario(Long id, String usuario) { return "Usuario actualizado con ID: " + id; }
    public String deleteUsuario(Long id) { return "Usuario eliminado con ID: " + id; }
}
