package com.coyoteuniformes.tienda_online.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.coyoteuniformes.tienda_online.entity.Categoria;
import com.coyoteuniformes.tienda_online.entity.dto.CategoriaAdminDto;

public interface CategoriaRepository extends JpaRepository<Categoria, Long>{

    public Categoria findByNombre(String nombre);

    @Query(value = """
        SELECT
            c.id_categoria       AS idCategoria,
            c.nombre             AS nombre,
            c.descripcion        AS descripcion,
            COUNT(p.id_producto) AS cantidadProductos
        FROM categorias c
        LEFT JOIN productos p ON p.id_categoria = c.id_categoria
        GROUP BY c.id_categoria, c.nombre, c.descripcion
        ORDER BY c.id_categoria DESC
        """, nativeQuery = true)
    List<CategoriaAdminDto> findCategoriasAdmin();
}
