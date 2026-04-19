package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.DetallePedido;
import com.coyoteuniformes.tienda_online.entity.dto.DetallePedidoDto;
import com.coyoteuniformes.tienda_online.exceptions.DetallePedidoException;
import com.coyoteuniformes.tienda_online.repository.DetallePedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class DetallePedidoService implements IDetallePedidoService {

    private final DetallePedidoRepository detallePedidoRepository;

    public DetallePedidoService(DetallePedidoRepository detallePedidoRepository) {
        this.detallePedidoRepository = detallePedidoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DetallePedidoDto> getAllDetallesPedido() {
        return detallePedidoRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DetallePedidoDto getDetallePedidoById(Long id) {
        return toDto(findDetalleById(id));
    }

    @Override
    public DetallePedidoDto createDetallePedido(DetallePedidoDto detallePedidoDto) {
        DetallePedido detallePedido = DetallePedido.builder()
                .idPedido(validatePositive(detallePedidoDto.getIdPedido(), "El id del pedido es obligatorio"))
                .idVariante(validatePositive(detallePedidoDto.getIdVariante(), "El id de la variante es obligatorio"))
                .cantidad(validateCantidad(detallePedidoDto.getCantidad()))
                .precioUnitario(validateMonto(detallePedidoDto.getPrecioUnitario()))
                .subtotal(resolveSubtotal(detallePedidoDto))
                .build();

        return toDto(detallePedidoRepository.save(detallePedido));
    }

    @Override
    public DetallePedidoDto updateDetallePedido(Long id, DetallePedidoDto detallePedidoDto) {
        DetallePedido detallePedido = findDetalleById(id);
        detallePedido.setIdPedido(validatePositive(detallePedidoDto.getIdPedido(), "El id del pedido es obligatorio"));
        detallePedido.setIdVariante(validatePositive(detallePedidoDto.getIdVariante(), "El id de la variante es obligatorio"));
        detallePedido.setCantidad(validateCantidad(detallePedidoDto.getCantidad()));
        detallePedido.setPrecioUnitario(validateMonto(detallePedidoDto.getPrecioUnitario()));
        detallePedido.setSubtotal(resolveSubtotal(detallePedidoDto));

        return toDto(detallePedidoRepository.save(detallePedido));
    }

    @Override
    public void deleteDetallePedido(Long id) {
        DetallePedido detallePedido = findDetalleById(id);
        detallePedidoRepository.delete(detallePedido);
    }

    @Transactional(readOnly = true)
    public DetallePedido findDetalleById(Long id) {
        return detallePedidoRepository.findById(id)
                .orElseThrow(() -> new DetallePedidoException("No existe un detalle de pedido con ID " + id));
    }

    private DetallePedidoDto toDto(DetallePedido detallePedido) {
        return DetallePedidoDto.builder()
                .idDetallePedido(detallePedido.getIdDetallePedido())
                .idPedido(detallePedido.getIdPedido())
                .idVariante(detallePedido.getIdVariante())
                .cantidad(detallePedido.getCantidad())
                .precioUnitario(detallePedido.getPrecioUnitario())
                .subtotal(detallePedido.getSubtotal())
                .build();
    }

    private Long validatePositive(Long value, String message) {
        if (value == null || value <= 0) {
            throw new DetallePedidoException(message);
        }
        return value;
    }

    private Integer validateCantidad(Integer cantidad) {
        if (cantidad == null || cantidad <= 0) {
            throw new DetallePedidoException("La cantidad debe ser mayor a cero");
        }
        return cantidad;
    }

    private BigDecimal validateMonto(BigDecimal value) {
        if (value == null) {
            throw new DetallePedidoException("El precio unitario es obligatorio");
        }
        if (value.signum() < 0) {
            throw new DetallePedidoException("El precio unitario no puede ser negativo");
        }
        return value;
    }

    private BigDecimal resolveSubtotal(DetallePedidoDto detallePedidoDto) {
        if (detallePedidoDto.getSubtotal() != null && detallePedidoDto.getSubtotal().signum() >= 0) {
            return detallePedidoDto.getSubtotal();
        }
        return detallePedidoDto.getPrecioUnitario().multiply(BigDecimal.valueOf(detallePedidoDto.getCantidad()));
    }
}
