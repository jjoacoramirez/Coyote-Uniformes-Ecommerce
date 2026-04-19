package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.dto.AdministradorDto;

import java.util.List;

public interface IAdministradorService {
    List<AdministradorDto> getAllAdministradores();
    AdministradorDto getAdministradorById(Long id);
    AdministradorDto createAdministrador(AdministradorDto administradorDto);
    AdministradorDto updateAdministrador(Long id, AdministradorDto administradorDto);
    void deleteAdministrador(Long id);
}
