package com.coyoteuniformes.tienda_online.service;

import java.util.List;
import java.util.Optional;

import com.coyoteuniformes.tienda_online.entity.dto.VarianteProductoDto;

public interface IVarianteProductoService {
    List<VarianteProductoDto> getAllVariantes();
    Optional<VarianteProductoDto> getVarianteById(Long id);
    VarianteProductoDto createVariante(VarianteProductoDto dto);
    VarianteProductoDto updateVariante(Long id, VarianteProductoDto dto);
    void deleteVariante(Long id);
}
