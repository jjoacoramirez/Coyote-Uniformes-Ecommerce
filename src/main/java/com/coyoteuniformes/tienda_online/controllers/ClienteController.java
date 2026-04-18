package com.coyoteuniformes.tienda_online.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coyoteuniformes.tienda_online.entity.Cliente;
import com.coyoteuniformes.tienda_online.service.ClienteService;

@RestController
@RequestMapping("clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    @GetMapping
    public String getAllClientes() {
        return clienteService.getAllClientes();
    }

    @GetMapping("/{id}")
    public String getClienteById(@PathVariable Long id) {
        return clienteService.getClienteById(id);
    }

    @PostMapping
    public String createCliente(@RequestBody Cliente cliente) {
        return clienteService.createCliente(cliente.toString());
    }

    @PutMapping("/{id}")
    public String updateCliente(@PathVariable Long id, @RequestBody Cliente cliente) {
        return clienteService.updateCliente(id, cliente.toString());
    }

    @DeleteMapping("/{id}")
    public String deleteCliente(@PathVariable Long id) {
        return clienteService.deleteCliente(id);
    }
}
