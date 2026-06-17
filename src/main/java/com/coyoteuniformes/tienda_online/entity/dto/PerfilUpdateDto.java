package com.coyoteuniformes.tienda_online.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerfilUpdateDto {
    private String nombre;
    private String apellido;
    private String telefono;
    private Boolean actualizarDireccion;
    private String calle;
    private String numero;
    private String ciudad;
    private String provincia;
    private String codigoPostal;
    private String pais;
}
