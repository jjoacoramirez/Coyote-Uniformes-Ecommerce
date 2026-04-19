package com.coyoteuniformes.tienda_online.entity.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteDto {
    private Long idCliente;

    @NotNull(message = "El id del usuario es obligatorio")
    private Long idUsuario;

    private String dni;
    private String cuitCuil;
    private String calle;
    private String numero;
    private String ciudad;
    private String provincia;
    private String codigoPostal;
    private String pais;
}
