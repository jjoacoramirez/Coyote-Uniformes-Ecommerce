package com.coyoteuniformes.tienda_online.entity.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nombre;
    private String apellido;
    private String email;
    private String contrasena;
}
