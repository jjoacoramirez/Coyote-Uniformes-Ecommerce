package com.coyoteuniformes.tienda_online.service;

public interface IUsuarioService {
    String getAllUsuarios();
    String getUsuarioById(Long id);
    String createUsuario(String usuario);
    String updateUsuario(Long id, String usuario);
    String deleteUsuario(Long id);
}
