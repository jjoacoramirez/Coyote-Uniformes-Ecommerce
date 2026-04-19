package com.coyoteuniformes.tienda_online.repository;

import com.coyoteuniformes.tienda_online.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCaseAndIdUsuarioNot(String email, Long idUsuario);
    Optional<Usuario> findByEmailIgnoreCase(String email);
}
