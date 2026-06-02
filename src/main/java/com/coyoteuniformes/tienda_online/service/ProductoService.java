package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Categoria;
import com.coyoteuniformes.tienda_online.entity.Producto;
import com.coyoteuniformes.tienda_online.entity.dto.ProductoDto;
import com.coyoteuniformes.tienda_online.exceptions.ProductoException;
import com.coyoteuniformes.tienda_online.repository.CategoriaRepository;
import com.coyoteuniformes.tienda_online.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductoService implements IProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public List<Producto> getAllProductos() {
        return productoRepository.findAll();
    }

    @Override
    public Optional<Producto> getProductoById(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    public Producto createProducto(ProductoDto dto, MultipartFile imagen) throws IOException {
        Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
            .orElseThrow(() -> new ProductoException("Categoría no encontrada: " + dto.getIdCategoria()));

        Producto producto = new Producto();
        producto.setCategoria(categoria);
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecioBase(dto.getPrecioBase());
        producto.setActivo(dto.getActivo() != null ? dto.getActivo() : Boolean.TRUE);

        if (imagen != null && !imagen.isEmpty()) {
            producto.setImagenUrl(cloudinaryService.subirImagen(imagen));
        } else {
            producto.setImagenUrl(dto.getImagenUrl());
        }

        return productoRepository.save(producto);
    }

    @Override
    public Producto updateProducto(Long id, ProductoDto dto, MultipartFile imagen) throws IOException {
        Producto existente = productoRepository.findById(id)
            .orElseThrow(() -> new ProductoException("Producto no encontrado: " + id));

        if (dto.getNombre() != null)      existente.setNombre(dto.getNombre());
        if (dto.getDescripcion() != null) existente.setDescripcion(dto.getDescripcion());
        if (dto.getPrecioBase() != null)  existente.setPrecioBase(dto.getPrecioBase());
        if (dto.getActivo() != null)      existente.setActivo(dto.getActivo());

        if (dto.getIdCategoria() != null) {
            Categoria categoria = categoriaRepository.findById(dto.getIdCategoria())
                .orElseThrow(() -> new ProductoException("Categoría no encontrada: " + dto.getIdCategoria()));
            existente.setCategoria(categoria);
        }

        if (imagen != null && !imagen.isEmpty()) {
            if (existente.getImagenUrl() != null) {
                cloudinaryService.eliminarImagen(existente.getImagenUrl());
            }
            existente.setImagenUrl(cloudinaryService.subirImagen(imagen));
        }

        return productoRepository.save(existente);
    }

    @Override
    public void deleteProducto(Long id) throws IOException {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new ProductoException("Producto no encontrado: " + id));

        if (producto.getImagenUrl() != null) {
            cloudinaryService.eliminarImagen(producto.getImagenUrl());
        }

        productoRepository.delete(producto);
    }
}
