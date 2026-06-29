package com.coyoteuniformes.tienda_online.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "contactos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contacto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idContacto;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String correo;

    @Column(nullable = false)
    private String motivo;

    @Column(nullable = false, length = 1000)
    private String mensaje;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    private void prePersist() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }
}
