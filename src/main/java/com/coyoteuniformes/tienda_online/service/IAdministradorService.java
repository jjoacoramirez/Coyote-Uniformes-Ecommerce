package com.coyoteuniformes.tienda_online.service;

public interface IAdministradorService {
    String getAllAdministradores();
    String getAdministradorById(Long id);
    String createAdministrador(String administrador);
    String updateAdministrador(Long id, String administrador);
    String deleteAdministrador(Long id);
}
