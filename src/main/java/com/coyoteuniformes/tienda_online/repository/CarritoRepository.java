package com.coyoteuniformes.tienda_online.repository;

import com.coyoteuniformes.tienda_online.entity.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
}
