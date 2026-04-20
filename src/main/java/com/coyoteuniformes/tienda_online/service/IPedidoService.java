package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.dto.PedidoDto;

import java.util.List;

public interface IPedidoService {
    List<PedidoDto> getAllPedidos();
    PedidoDto getPedidoById(Long id);
    PedidoDto createPedido(PedidoDto pedidoDto);
    PedidoDto updatePedido(Long id, PedidoDto pedidoDto);
    void deletePedido(Long id);
}
