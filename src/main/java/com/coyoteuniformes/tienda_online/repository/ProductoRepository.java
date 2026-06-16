package com.coyoteuniformes.tienda_online.repository;

import com.coyoteuniformes.tienda_online.entity.Producto;
import com.coyoteuniformes.tienda_online.entity.dto.ProductoAdminDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query(value = """
            SELECT
                p.id_producto   AS idProducto,
                p.nombre        AS nombre,
                p.precio_base   AS precioBase,
                p.imagen_url    AS imagenUrl,
                p.activo        AS activo,
                c.id_categoria  AS idCategoria,
                c.nombre        AS categoriaNombre,
                COALESCE(SUM(v.stock), 0) AS stockTotal,
                MIN(v.sku)      AS skuPrincipal
            FROM productos p
            LEFT JOIN categorias c  ON c.id_categoria = p.id_categoria
            LEFT JOIN variantes_producto v ON v.id_producto = p.id_producto
            GROUP BY p.id_producto, p.nombre, p.precio_base, p.imagen_url,
                     p.activo, c.id_categoria, c.nombre
            ORDER BY p.id_producto DESC
            """, nativeQuery = true)
    List<ProductoAdminDto> findProductosAdmin();
}
