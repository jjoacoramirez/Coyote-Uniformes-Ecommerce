package com.coyoteuniformes.tienda_online.service;

public interface IDetallePedidoService {
    String getAllDetallesPedido();
    String getDetallePedidoById(Long id);
    String createDetallePedido(String detallePedido);
    String updateDetallePedido(Long id, String detallePedido);
    String deleteDetallePedido(Long id);
}
