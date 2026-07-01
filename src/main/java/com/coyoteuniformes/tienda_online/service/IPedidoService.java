package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.dto.PedidoDto;

import java.util.List;

public interface IPedidoService {
    List<PedidoDto> getPedidos(String email, boolean admin);
    PedidoDto getPedidoById(Long id, String email, boolean admin);
    PedidoDto createPedido(PedidoDto pedidoDto, String email, boolean admin);
    PedidoDto updatePedido(Long id, PedidoDto pedidoDto);
    void deletePedido(Long id);
}
