package com.coyoteuniformes.tienda_online.repository;

import com.coyoteuniformes.tienda_online.entity.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Optional<Carrito> findFirstByClienteIdClienteAndEstadoIgnoreCaseOrderByIdCarritoDesc(Long idCliente, String estado);
}
