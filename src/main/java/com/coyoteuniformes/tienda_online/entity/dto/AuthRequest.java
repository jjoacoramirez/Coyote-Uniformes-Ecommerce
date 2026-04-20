package com.coyoteuniformes.tienda_online.entity.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
