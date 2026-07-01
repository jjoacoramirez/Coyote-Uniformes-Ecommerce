package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Pedido;
import com.coyoteuniformes.tienda_online.entity.dto.PedidoDto;
import com.coyoteuniformes.tienda_online.exceptions.PedidoException;
import com.coyoteuniformes.tienda_online.repository.PedidoRepository;
import com.coyoteuniformes.tienda_online.repository.ClienteRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class PedidoService implements IPedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;

    public PedidoService(PedidoRepository pedidoRepository, ClienteRepository clienteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoDto> getPedidos(String email, boolean admin) {
        List<Pedido> pedidos = admin
                ? pedidoRepository.findAll()
                : clienteRepository.findByUsuarioEmailIgnoreCase(email)
                        .map(cliente -> pedidoRepository.findByIdCliente(cliente.getIdCliente()))
                        .orElseGet(List::of);

        return pedidos
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PedidoDto getPedidoById(Long id, String email, boolean admin) {
        Pedido pedido = findPedidoById(id);
        validatePedidoOwner(pedido, email, admin);
        return toDto(pedido);
    }

    @Override
    public PedidoDto createPedido(PedidoDto pedidoDto, String email, boolean admin) {
        Long idCliente = admin
                ? validatePositive(pedidoDto.getIdCliente(), "El id del cliente es obligatorio")
                : getClienteId(email);

        Pedido pedido = Pedido.builder()
                .idCliente(idCliente)
                .fechaPedido(pedidoDto.getFechaPedido() != null ? pedidoDto.getFechaPedido() : LocalDate.now())
                .estado(validateEstado(pedidoDto.getEstado()))
                .total(validateMonto(pedidoDto.getTotal()))
                .build();

        return toDto(pedidoRepository.save(pedido));
    }

    @Override
    public PedidoDto updatePedido(Long id, PedidoDto pedidoDto) {
        Pedido pedido = findPedidoById(id);
        pedido.setIdCliente(validatePositive(pedidoDto.getIdCliente(), "El id del cliente es obligatorio"));
        pedido.setFechaPedido(pedidoDto.getFechaPedido() != null ? pedidoDto.getFechaPedido() : pedido.getFechaPedido());
        pedido.setEstado(validateEstado(pedidoDto.getEstado()));
        pedido.setTotal(validateMonto(pedidoDto.getTotal()));

        return toDto(pedidoRepository.save(pedido));
    }

    @Override
    public void deletePedido(Long id) {
        Pedido pedido = findPedidoById(id);
        pedidoRepository.delete(pedido);
    }

    @Transactional(readOnly = true)
    public Pedido findPedidoById(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new PedidoException("No existe un pedido con ID " + id));
    }

    private Long getClienteId(String email) {
        return clienteRepository.findByUsuarioEmailIgnoreCase(email)
                .map(cliente -> cliente.getIdCliente())
                .orElseThrow(() -> new PedidoException("El usuario no tiene un perfil de cliente asociado"));
    }

    private void validatePedidoOwner(Pedido pedido, String email, boolean admin) {
        if (admin) {
            return;
        }

        Long clienteId = clienteRepository.findByUsuarioEmailIgnoreCase(email)
                .map(cliente -> cliente.getIdCliente())
                .orElseThrow(() -> new AccessDeniedException("No tenés acceso a este pedido"));

        if (!clienteId.equals(pedido.getIdCliente())) {
            throw new AccessDeniedException("No tenés acceso a este pedido");
        }
    }

    private PedidoDto toDto(Pedido pedido) {
        return PedidoDto.builder()
                .idPedido(pedido.getIdPedido())
                .idCliente(pedido.getIdCliente())
                .fechaPedido(pedido.getFechaPedido())
                .estado(pedido.getEstado())
                .total(pedido.getTotal())
                .build();
    }

    private Long validatePositive(Long value, String message) {
        if (value == null || value <= 0) {
            throw new PedidoException(message);
        }
        return value;
    }

    private java.math.BigDecimal validateMonto(java.math.BigDecimal value) {
        if (value == null) {
            throw new PedidoException("El total del pedido es obligatorio");
        }
        if (value.signum() < 0) {
            throw new PedidoException("El total del pedido no puede ser negativo");
        }
        return value;
    }

    private String validateEstado(String estado) {
        if (estado == null || estado.trim().isEmpty()) {
            throw new PedidoException("El estado del pedido es obligatorio");
        }
        return estado.trim().toUpperCase();
    }
}
