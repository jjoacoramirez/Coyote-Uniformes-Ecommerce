package com.coyoteuniformes.tienda_online.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.coyoteuniformes.tienda_online.entity.VarianteProducto;

import java.util.List;

public interface VarianteProductoRepository extends JpaRepository<VarianteProducto, Long>{

    @Query("SELECT v FROM VarianteProducto v WHERE v.producto.idProducto = :idProducto")
    List<VarianteProducto> findByProducto_IdProducto(@Param("idProducto") Long idProducto);

    @Query("SELECT COUNT(v) FROM VarianteProducto v WHERE v.producto.idProducto = :idProducto")
    long countByProductoId(@Param("idProducto") Long idProducto);
}
