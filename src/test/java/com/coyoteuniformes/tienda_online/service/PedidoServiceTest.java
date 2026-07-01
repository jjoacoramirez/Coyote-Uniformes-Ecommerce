package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Cliente;
import com.coyoteuniformes.tienda_online.entity.Pedido;
import com.coyoteuniformes.tienda_online.entity.dto.PedidoDto;
import com.coyoteuniformes.tienda_online.repository.ClienteRepository;
import com.coyoteuniformes.tienda_online.repository.PedidoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @Mock
    private PedidoRepository pedidoRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @InjectMocks
    private PedidoService pedidoService;

    @Test
    void usuarioSoloListaPedidosDeSuCliente() {
        Cliente cliente = Cliente.builder().idCliente(7L).build();
        Pedido pedido = pedido(10L, 7L);
        when(clienteRepository.findByUsuarioEmailIgnoreCase("user@test.com")).thenReturn(Optional.of(cliente));
        when(pedidoRepository.findByIdCliente(7L)).thenReturn(List.of(pedido));

        List<PedidoDto> resultado = pedidoService.getPedidos("user@test.com", false);

        assertEquals(List.of(10L), resultado.stream().map(PedidoDto::getIdPedido).toList());
        verify(pedidoRepository, never()).findAll();
    }

    @Test
    void usuarioNoPuedeAbrirPedidoAjeno() {
        when(pedidoRepository.findById(10L)).thenReturn(Optional.of(pedido(10L, 99L)));
        when(clienteRepository.findByUsuarioEmailIgnoreCase("user@test.com"))
                .thenReturn(Optional.of(Cliente.builder().idCliente(7L).build()));

        assertThrows(AccessDeniedException.class,
                () -> pedidoService.getPedidoById(10L, "user@test.com", false));
    }

    @Test
    void usuarioNoPuedeCrearPedidoParaOtroCliente() {
        when(clienteRepository.findByUsuarioEmailIgnoreCase("user@test.com"))
                .thenReturn(Optional.of(Cliente.builder().idCliente(7L).build()));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocation -> invocation.getArgument(0));
        PedidoDto entrada = PedidoDto.builder()
                .idCliente(99L)
                .estado("pendiente")
                .total(BigDecimal.TEN)
                .build();

        PedidoDto resultado = pedidoService.createPedido(entrada, "user@test.com", false);

        assertEquals(7L, resultado.getIdCliente());
    }

    private Pedido pedido(Long idPedido, Long idCliente) {
        return Pedido.builder()
                .idPedido(idPedido)
                .idCliente(idCliente)
                .fechaPedido(LocalDate.now())
                .estado("PENDIENTE")
                .total(BigDecimal.TEN)
                .build();
    }
}
