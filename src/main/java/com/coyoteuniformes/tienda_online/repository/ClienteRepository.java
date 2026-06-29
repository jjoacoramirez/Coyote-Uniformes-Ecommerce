package com.coyoteuniformes.tienda_online.repository;

import com.coyoteuniformes.tienda_online.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    boolean existsByUsuarioIdUsuario(Long idUsuario);
    boolean existsByUsuarioIdUsuarioAndIdClienteNot(Long idUsuario, Long idCliente);
    boolean existsByDni(String dni);
    boolean existsByDniAndIdClienteNot(String dni, Long idCliente);
    Optional<Cliente> findByUsuarioEmailIgnoreCase(String email);
}
