package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Descuento;
import com.coyoteuniformes.tienda_online.entity.dto.DescuentoDto;

import java.util.List;

public interface IDescuentoService {
    List<Descuento> getAllDescuentos();
    Descuento getDescuentoById(Long id);
    Descuento validarDescuento(String codigo);
    Descuento createDescuento(DescuentoDto dto);
    Descuento updateDescuento(Long id, DescuentoDto dto);
    void deleteDescuento(Long id);
}
