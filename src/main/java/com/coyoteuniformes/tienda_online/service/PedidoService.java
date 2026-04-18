package com.coyoteuniformes.tienda_online.service;

import org.springframework.stereotype.Service;

@Service
public class PedidoService implements IPedidoService {

    public String getAllPedidos() { return "Lista de pedidos"; }
    public String getPedidoById(Long id) { return "Pedido con ID: " + id; }
    public String createPedido(String pedido) { return "Pedido creado"; }
    public String updatePedido(Long id, String pedido) { return "Pedido actualizado con ID: " + id; }
    public String deletePedido(Long id) { return "Pedido eliminado con ID: " + id; }
}
