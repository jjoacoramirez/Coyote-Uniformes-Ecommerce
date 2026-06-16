package com.coyoteuniformes.tienda_online.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.coyoteuniformes.tienda_online.entity.VarianteProducto;
import com.coyoteuniformes.tienda_online.repository.VarianteProductoRepository;

@Service
public class VarianteProductoService implements IVarianteProductoService {

    private final VarianteProductoRepository varianteProductoRepository;

    VarianteProductoService(VarianteProductoRepository varianteProductoRepository) {
        this.varianteProductoRepository = varianteProductoRepository;
    }

    public List<VarianteProducto> getAllVariantes() {
        return varianteProductoRepository.findAll();
    }

    public List<VarianteProducto> getVariantesByProductoId(Long idProducto) {
        return varianteProductoRepository.findByProducto_IdProducto(idProducto);
    }

    public Optional<VarianteProducto> getVarianteById(Long id) {
        return varianteProductoRepository.findById(id);
    }

    public VarianteProducto createVariante(VarianteProducto variante) {
        return varianteProductoRepository.save(variante);
    }

    public VarianteProducto updateVariante(Long id, VarianteProducto variante) {
        VarianteProducto existente = varianteProductoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variante no encontrada"));

        existente.setProducto(variante.getProducto());
        existente.setTalle(variante.getTalle());
        existente.setColor(variante.getColor());
        existente.setStock(variante.getStock());
        existente.setSku(variante.getSku());
        existente.setPrecio(variante.getPrecio());
        existente.setActivo(variante.getActivo());

        return varianteProductoRepository.save(existente);
    }

    public void deleteVariante(Long id) {
        varianteProductoRepository.deleteById(id);
    }
}
