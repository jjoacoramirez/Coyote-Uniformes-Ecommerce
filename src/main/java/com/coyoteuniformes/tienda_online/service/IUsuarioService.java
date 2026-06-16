package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.dto.CambiarPasswordDto;
import com.coyoteuniformes.tienda_online.entity.dto.PerfilUpdateDto;
import com.coyoteuniformes.tienda_online.entity.dto.UsuarioDto;

import java.util.List;

public interface IUsuarioService {
    List<UsuarioDto> getAllUsuarios();
    UsuarioDto getUsuarioById(Long id);
    UsuarioDto createUsuario(UsuarioDto usuarioDto);
    UsuarioDto updateUsuario(Long id, UsuarioDto usuarioDto);
    void deleteUsuario(Long id);

    UsuarioDto getPerfilByEmail(String email);
    UsuarioDto updatePerfilByEmail(String email, PerfilUpdateDto dto);
    void cambiarPassword(String email, CambiarPasswordDto dto);
}
