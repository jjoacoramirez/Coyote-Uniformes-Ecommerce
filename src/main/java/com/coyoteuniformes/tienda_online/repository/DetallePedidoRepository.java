package com.coyoteuniformes.tienda_online.repository;

import com.coyoteuniformes.tienda_online.entity.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {
	List<DetallePedido> findByIdPedido(Long idPedido);
}
