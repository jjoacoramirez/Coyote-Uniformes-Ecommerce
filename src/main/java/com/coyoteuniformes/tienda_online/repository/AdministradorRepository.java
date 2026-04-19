package com.coyoteuniformes.tienda_online.repository;

import com.coyoteuniformes.tienda_online.entity.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdministradorRepository extends JpaRepository<Administrador, Long> {
    boolean existsByUsuarioIdUsuario(Long idUsuario);
    boolean existsByUsuarioIdUsuarioAndIdAdminNot(Long idUsuario, Long idAdmin);
    boolean existsByLegajo(String legajo);
    boolean existsByLegajoAndIdAdminNot(String legajo, Long idAdmin);
}
