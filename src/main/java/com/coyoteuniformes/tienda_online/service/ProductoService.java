package com.coyoteuniformes.tienda_online.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.coyoteuniformes.tienda_online.entity.Categoria;
import com.coyoteuniformes.tienda_online.entity.Producto;
import com.coyoteuniformes.tienda_online.entity.dto.ProductoDto;
import com.coyoteuniformes.tienda_online.exceptions.ProductoException;
import com.coyoteuniformes.tienda_online.repository.CategoriaRepository;
import com.coyoteuniformes.tienda_online.repository.ProductoRepository;

@Service
@Transactional
public class ProductoService implements IProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    ProductoService(ProductoRepository productoRepository, CategoriaRepository categoriaRepository) {
        this.productoRepository = productoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductoDto> getAllProductos() {
        return productoRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProductoDto> getProductoById(Long id) {
        return productoRepository.findById(id).map(this::toDto);
    }

    @Override
    public ProductoDto createProducto(ProductoDto dto) {
        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new ProductoException("No existe una categoría con ID " + dto.getIdCategoria()));

        Producto producto = Producto.builder()
                .Categoria(categoria)
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .precioBase(dto.getPrecioBase())
                .imagenUrl(dto.getImagenUrl())
                .activo(dto.getActivo() != null ? dto.getActivo() : true)
                .build();

        return toDto(productoRepository.save(producto));
    }

    @Override
    public ProductoDto updateProducto(Long id, ProductoDto dto) {
        Producto existente = productoRepository.findById(id)
                .orElseThrow(() -> new ProductoException("No existe un producto con ID " + id));

        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new ProductoException("No existe una categoría con ID " + dto.getIdCategoria()));

        existente.setCategoria(categoria);
        existente.setNombre(dto.getNombre());
        existente.setDescripcion(dto.getDescripcion());
        existente.setPrecioBase(dto.getPrecioBase());
        existente.setImagenUrl(dto.getImagenUrl());
        existente.setActivo(dto.getActivo());

        return toDto(productoRepository.save(existente));
    }

    @Override
    public void deleteProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ProductoException("No existe un producto con ID " + id);
        }
        productoRepository.deleteById(id);
    }

    private ProductoDto toDto(Producto producto) {
        return ProductoDto.builder()
                .idProducto(producto.getIdProducto())
                .idCategoria(producto.getCategoria() != null ? producto.getCategoria().getIdCategoria() : null)
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precioBase(producto.getPrecioBase())
                .imagenUrl(producto.getImagenUrl())
                .activo(producto.getActivo())
                .build();
    }
}
