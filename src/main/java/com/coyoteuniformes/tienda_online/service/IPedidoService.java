package com.coyoteuniformes.tienda_online.service;

public interface IPedidoService {
    String getAllPedidos();
    String getPedidoById(Long id);
    String createPedido(String pedido);
    String updatePedido(Long id, String pedido);
    String deletePedido(Long id);
}
