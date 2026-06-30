package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Descuento;
import com.coyoteuniformes.tienda_online.entity.dto.DescuentoDto;
import com.coyoteuniformes.tienda_online.exceptions.DescuentoException;
import com.coyoteuniformes.tienda_online.repository.DescuentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DescuentoService implements IDescuentoService {

    private final DescuentoRepository descuentoRepository;

    @Override
    public List<Descuento> getAllDescuentos() {
        return descuentoRepository.findAll();
    }

    @Override
    public Descuento getDescuentoById(Long id) {
        return descuentoRepository.findById(id)
            .orElseThrow(() -> new DescuentoException("Descuento no encontrado: " + id));
    }

    @Override
    public Descuento validarDescuento(String codigo) {
        Descuento descuento = descuentoRepository.findByCodigo(codigo.trim().toUpperCase())
            .orElseThrow(() -> new DescuentoException("Cupón inválido"));

        if (!Boolean.TRUE.equals(descuento.getActivo())) {
            throw new DescuentoException("El cupón no está activo");
        }

        LocalDate hoy = LocalDate.now();
        if (hoy.isBefore(descuento.getFechaInicio())) {
            throw new DescuentoException("El cupón aún no está vigente");
        }
        if (descuento.getFechaFin() != null && hoy.isAfter(descuento.getFechaFin())) {
            throw new DescuentoException("El cupón ha expirado");
        }
        if (descuento.getUsoMaximo() != null && descuento.getUsoActual() >= descuento.getUsoMaximo()) {
            throw new DescuentoException("El cupón ha alcanzado su límite de usos");
        }

        return descuento;
    }

    @Override
    @Transactional
    public Descuento registrarUso(String codigo) {
        // Revalida (activo, vigencia y tope de usos) antes de sumar el uso.
        Descuento descuento = validarDescuento(codigo);

        int usosActuales = descuento.getUsoActual() != null ? descuento.getUsoActual() : 0;
        descuento.setUsoActual(usosActuales + 1);

        // Al alcanzar el máximo de usos, el cupón queda inhabilitado.
        if (descuento.getUsoMaximo() != null && descuento.getUsoActual() >= descuento.getUsoMaximo()) {
            descuento.setActivo(false);
        }

        return descuentoRepository.save(descuento);
    }

    @Override
    public Descuento createDescuento(DescuentoDto dto) {
        Descuento descuento = Descuento.builder()
            .codigo(dto.getCodigo().trim().toUpperCase())
            .tipo(dto.getTipo())
            .valor(dto.getValor())
            .fechaInicio(dto.getFechaInicio())
            .fechaFin(dto.getFechaFin())
            .activo(dto.getActivo() != null ? dto.getActivo() : Boolean.TRUE)
            .usoMaximo(dto.getUsoMaximo())
            .usoActual(0)
            .montoMinimo(dto.getMontoMinimo())
            .build();
        return descuentoRepository.save(descuento);
    }

    @Override
    public Descuento updateDescuento(Long id, DescuentoDto dto) {
        Descuento existente = getDescuentoById(id);

        if (dto.getCodigo() != null) existente.setCodigo(dto.getCodigo().trim().toUpperCase());
        if (dto.getTipo() != null)   existente.setTipo(dto.getTipo());
        if (dto.getValor() != null)  existente.setValor(dto.getValor());
        if (dto.getFechaInicio() != null) existente.setFechaInicio(dto.getFechaInicio());
        existente.setFechaFin(dto.getFechaFin());
        if (dto.getActivo() != null)     existente.setActivo(dto.getActivo());
        existente.setUsoMaximo(dto.getUsoMaximo());
        if (dto.getUsoActual() != null)  existente.setUsoActual(dto.getUsoActual());
        existente.setMontoMinimo(dto.getMontoMinimo());

        return descuentoRepository.save(existente);
    }

    @Override
    public void deleteDescuento(Long id) {
        getDescuentoById(id);
        descuentoRepository.deleteById(id);
    }
}
