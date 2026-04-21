package com.coyoteuniformes.tienda_online.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.coyoteuniformes.tienda_online.entity.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long>{
    
    public Categoria findByNombre(String nombre);

}
