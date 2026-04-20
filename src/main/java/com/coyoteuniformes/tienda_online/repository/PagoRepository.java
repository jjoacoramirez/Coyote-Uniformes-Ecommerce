package com.coyoteuniformes.tienda_online.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.coyoteuniformes.tienda_online.entity.Pago;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
}