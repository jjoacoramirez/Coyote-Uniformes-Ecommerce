package com.coyoteuniformes.tienda_online.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDto {
    private Long idUsuario;
    private String nombre;
    private String apellido;
    private String email;
    private String contrasena;
    private String telefono;
    private String rol;
    private LocalDate fechaRegistro;
    private String estado;
}
