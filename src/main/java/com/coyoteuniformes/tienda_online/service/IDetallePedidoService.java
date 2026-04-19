package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.dto.DetallePedidoDto;

import java.util.List;

public interface IDetallePedidoService {
    List<DetallePedidoDto> getAllDetallesPedido();
    DetallePedidoDto getDetallePedidoById(Long id);
    DetallePedidoDto createDetallePedido(DetallePedidoDto detallePedidoDto);
    DetallePedidoDto updateDetallePedido(Long id, DetallePedidoDto detallePedidoDto);
    void deleteDetallePedido(Long id);
}
