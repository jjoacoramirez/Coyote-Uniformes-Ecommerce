package com.coyoteuniformes.tienda_online.controllers;

import com.coyoteuniformes.tienda_online.entity.dto.PedidoDto;
import org.springframework.web.bind.annotation.*;
import com.coyoteuniformes.tienda_online.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping
    public ResponseEntity<List<PedidoDto>> getAllPedidos(Authentication authentication) {
        return ResponseEntity.ok(pedidoService.getPedidos(
                authentication.getName(), isAdmin(authentication)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDto> getPedidoById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(pedidoService.getPedidoById(
                id, authentication.getName(), isAdmin(authentication)));
    }

    @PostMapping
    public ResponseEntity<PedidoDto> createPedido(
            @Valid @RequestBody PedidoDto pedidoDto,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.createPedido(
                pedidoDto, authentication.getName(), isAdmin(authentication)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDto> updatePedido(@PathVariable Long id, @Valid @RequestBody PedidoDto pedidoDto) {
        return ResponseEntity.ok(pedidoService.updatePedido(id, pedidoDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable Long id) {
        pedidoService.deletePedido(id);
        return ResponseEntity.noContent().build();
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }
}
