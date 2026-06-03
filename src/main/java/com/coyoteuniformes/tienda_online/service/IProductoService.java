package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Producto;
import com.coyoteuniformes.tienda_online.entity.dto.ProductoAdminDto;
import com.coyoteuniformes.tienda_online.entity.dto.ProductoDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IProductoService {
    List<Producto> getAllProductos();

    List<ProductoAdminDto> getProductosAdmin();

    Optional<Producto> getProductoById(Long id);

    Producto createProducto(ProductoDto dto, MultipartFile imagen) throws IOException;

    Producto updateProducto(Long id, ProductoDto dto, MultipartFile imagen) throws IOException;

    void deleteProducto(Long id) throws IOException;
}
