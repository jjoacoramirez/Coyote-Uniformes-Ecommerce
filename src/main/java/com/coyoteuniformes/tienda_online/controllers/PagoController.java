package com.coyoteuniformes.tienda_online.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coyoteuniformes.tienda_online.entity.Pago;
import com.coyoteuniformes.tienda_online.service.PagoService;

@RestController
@RequestMapping("pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @GetMapping
    public String getAllPagos() {
        return pagoService.getAllPagos();
    }

    @GetMapping("/{id}")
    public String getPagoById(@PathVariable Long id) {
        return pagoService.getPagoById(id);
    }

    @PostMapping
    public String createPago(@RequestBody Pago pago) {
        return pagoService.createPago(pago.toString());
    }

    @PutMapping("/{id}")
    public String updatePago(@PathVariable Long id, @RequestBody Pago pago) {
        return pagoService.updatePago(id, pago.toString());
    }

    @DeleteMapping("/{id}")
    public String deletePago(@PathVariable Long id) {
        return pagoService.deletePago(id);
    }
}
