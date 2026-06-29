package com.coyoteuniformes.tienda_online.controllers;

import com.coyoteuniformes.tienda_online.entity.Contacto;
import com.coyoteuniformes.tienda_online.repository.ContactoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("contactos")
@RequiredArgsConstructor
public class ContactoController {

    private final ContactoRepository contactoRepository;

    @GetMapping
    public List<Contacto> getContactos() {
        return contactoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Contacto> crearContacto(@RequestBody Contacto contacto) {
        if (!StringUtils.hasText(contacto.getNombre())
                || !StringUtils.hasText(contacto.getCorreo())
                || !StringUtils.hasText(contacto.getMotivo())
                || !StringUtils.hasText(contacto.getMensaje())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Completa todos los campos del contacto");
        }

        contacto.setIdContacto(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(contactoRepository.save(contacto));
    }
}
