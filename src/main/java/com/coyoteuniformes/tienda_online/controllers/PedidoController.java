package com.coyoteuniformes.tienda_online.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coyoteuniformes.tienda_online.entity.Pedido;
import com.coyoteuniformes.tienda_online.service.PedidoService;

@RestController
@RequestMapping("pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public String getAllPedidos() {
        return pedidoService.getAllPedidos();
    }

    @GetMapping("/{id}")
    public String getPedidoById(@PathVariable Long id) {
        return pedidoService.getPedidoById(id);
    }

    @PostMapping
    public String createPedido(@RequestBody Pedido pedido) {
        return pedidoService.createPedido(pedido.toString());
    }

    @PutMapping("/{id}")
    public String updatePedido(@PathVariable Long id, @RequestBody Pedido pedido) {
        return pedidoService.updatePedido(id, pedido.toString());
    }

    @DeleteMapping("/{id}")
    public String deletePedido(@PathVariable Long id) {
        return pedidoService.deletePedido(id);
    }
}
