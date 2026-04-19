package com.coyoteuniformes.tienda_online.entity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdministradorDto {
    private Long idAdmin;

    @NotNull(message = "El id del usuario es obligatorio")
    private Long idUsuario;

    @NotBlank(message = "El legajo es obligatorio")
    private String legajo;
}
