package com.coyoteuniformes.tienda_online.controllers;

import com.coyoteuniformes.tienda_online.entity.dto.DetallePedidoDto;
import org.springframework.web.bind.annotation.*;
import com.coyoteuniformes.tienda_online.service.DetallePedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("detalles-pedido")
public class DetallePedidoController {

    private final DetallePedidoService detallePedidoService;

    public DetallePedidoController(DetallePedidoService detallePedidoService) {
        this.detallePedidoService = detallePedidoService;
    }

    @GetMapping
    public ResponseEntity<List<DetallePedidoDto>> getAllDetallesPedido() {
        return ResponseEntity.ok(detallePedidoService.getAllDetallesPedido());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetallePedidoDto> getDetallePedidoById(@PathVariable Long id) {
        return ResponseEntity.ok(detallePedidoService.getDetallePedidoById(id));
    }

    @PostMapping
    public ResponseEntity<DetallePedidoDto> createDetallePedido(@Valid @RequestBody DetallePedidoDto detallePedidoDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(detallePedidoService.createDetallePedido(detallePedidoDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DetallePedidoDto> updateDetallePedido(@PathVariable Long id, @Valid @RequestBody DetallePedidoDto detallePedidoDto) {
        return ResponseEntity.ok(detallePedidoService.updateDetallePedido(id, detallePedidoDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDetallePedido(@PathVariable Long id) {
        detallePedidoService.deleteDetallePedido(id);
        return ResponseEntity.noContent().build();
    }
}
