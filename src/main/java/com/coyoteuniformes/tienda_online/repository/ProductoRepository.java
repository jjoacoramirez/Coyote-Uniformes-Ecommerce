package com.coyoteuniformes.tienda_online.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.coyoteuniformes.tienda_online.entity.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
}
