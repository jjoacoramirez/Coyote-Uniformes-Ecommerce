package com.coyoteuniformes.tienda_online.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coyoteuniformes.tienda_online.entity.DetallePedido;
import com.coyoteuniformes.tienda_online.service.DetallePedidoService;

@RestController
@RequestMapping("detalles-pedido")
public class DetallePedidoController {

    @Autowired
    private DetallePedidoService detallePedidoService;

    @GetMapping
    public String getAllDetallesPedido() {
        return detallePedidoService.getAllDetallesPedido();
    }

    @GetMapping("/{id}")
    public String getDetallePedidoById(@PathVariable Long id) {
        return detallePedidoService.getDetallePedidoById(id);
    }

    @PostMapping
    public String createDetallePedido(@RequestBody DetallePedido detallePedido) {
        return detallePedidoService.createDetallePedido(detallePedido.toString());
    }

    @PutMapping("/{id}")
    public String updateDetallePedido(@PathVariable Long id, @RequestBody DetallePedido detallePedido) {
        return detallePedidoService.updateDetallePedido(id, detallePedido.toString());
    }

    @DeleteMapping("/{id}")
    public String deleteDetallePedido(@PathVariable Long id) {
        return detallePedidoService.deleteDetallePedido(id);
    }
}
