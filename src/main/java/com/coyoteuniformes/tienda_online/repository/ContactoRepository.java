package com.coyoteuniformes.tienda_online.repository;

import com.coyoteuniformes.tienda_online.entity.Contacto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactoRepository extends JpaRepository<Contacto, Long> {
}
