package com.coyoteuniformes.tienda_online.repository;

import com.coyoteuniformes.tienda_online.entity.ItemCarrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {
    List<ItemCarrito> findByCarritoIdCarrito(Long idCarrito);
    Optional<ItemCarrito> findByCarritoIdCarritoAndVarianteIdVariante(Long idCarrito, Long idVariante);
    void deleteByCarritoIdCarrito(Long idCarrito);
}
