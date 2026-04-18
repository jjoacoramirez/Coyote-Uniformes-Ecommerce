package com.coyoteuniformes.tienda_online.service;

import org.springframework.stereotype.Service;

@Service
public class DetallePedidoService implements IDetallePedidoService {

    public String getAllDetallesPedido() { return "Lista de detalles de pedido"; }
    public String getDetallePedidoById(Long id) { return "Detalle pedido con ID: " + id; }
    public String createDetallePedido(String detallePedido) { return "Detalle pedido creado"; }
    public String updateDetallePedido(Long id, String detallePedido) { return "Detalle pedido actualizado con ID: " + id; }
    public String deleteDetallePedido(Long id) { return "Detalle pedido eliminado con ID: " + id; }
}
