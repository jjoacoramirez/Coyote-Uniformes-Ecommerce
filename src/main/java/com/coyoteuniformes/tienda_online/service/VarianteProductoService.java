package com.coyoteuniformes.tienda_online.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coyoteuniformes.tienda_online.entity.Producto;
import com.coyoteuniformes.tienda_online.entity.VarianteProducto;
import com.coyoteuniformes.tienda_online.entity.dto.VarianteProductoDto;
import com.coyoteuniformes.tienda_online.exceptions.VarianteProductoException;
import com.coyoteuniformes.tienda_online.repository.ProductoRepository;
import com.coyoteuniformes.tienda_online.repository.VarianteProductoRepository;

@Service
@Transactional
public class VarianteProductoService implements IVarianteProductoService {

    private final VarianteProductoRepository varianteProductoRepository;
    private final ProductoRepository productoRepository;

    VarianteProductoService(VarianteProductoRepository varianteProductoRepository, ProductoRepository productoRepository) {
        this.varianteProductoRepository = varianteProductoRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VarianteProductoDto> getAllVariantes() {
        return varianteProductoRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<VarianteProductoDto> getVarianteById(Long id) {
        return varianteProductoRepository.findById(id).map(this::toDto);
    }

    @Override
    public VarianteProductoDto createVariante(VarianteProductoDto dto) {
        Producto producto = productoRepository.findById(dto.getIdProducto())
                .orElseThrow(() -> new VarianteProductoException("No existe un producto con ID " + dto.getIdProducto()));

        VarianteProducto variante = VarianteProducto.builder()
                .Producto(producto)
                .talle(dto.getTalle())
                .color(dto.getColor())
                .stock(dto.getStock())
                .sku(dto.getSku())
                .precio(dto.getPrecio())
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();

        return toDto(varianteProductoRepository.save(variante));
    }

    @Override
    public VarianteProductoDto updateVariante(Long id, VarianteProductoDto dto) {
        VarianteProducto existente = varianteProductoRepository.findById(id)
                .orElseThrow(() -> new VarianteProductoException("No existe una variante con ID " + id));

        Producto producto = productoRepository.findById(dto.getIdProducto())
                .orElseThrow(() -> new VarianteProductoException("No existe un producto con ID " + dto.getIdProducto()));

        existente.setProducto(producto);
        existente.setTalle(dto.getTalle());
        existente.setColor(dto.getColor());
        existente.setStock(dto.getStock());
        existente.setSku(dto.getSku());
        existente.setPrecio(dto.getPrecio());
        existente.setActivo(dto.getActivo());

        return toDto(varianteProductoRepository.save(existente));
    }

    @Override
    public void deleteVariante(Long id) {
        if (!varianteProductoRepository.existsById(id)) {
            throw new VarianteProductoException("No existe una variante con ID " + id);
        }
        varianteProductoRepository.deleteById(id);
    }

    private VarianteProductoDto toDto(VarianteProducto variante) {
        return VarianteProductoDto.builder()
                .idVariante(variante.getIdVariante())
                .idProducto(variante.getProducto() != null ? variante.getProducto().getIdProducto() : null)
                .talle(variante.getTalle())
                .color(variante.getColor())
                .stock(variante.getStock())
                .sku(variante.getSku())
                .precio(variante.getPrecio())
                .activo(variante.getActivo())
                .build();
    }
}
