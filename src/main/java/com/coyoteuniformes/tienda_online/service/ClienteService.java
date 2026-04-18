package com.coyoteuniformes.tienda_online.service;

import org.springframework.stereotype.Service;

@Service
public class ClienteService implements IClienteService {

    public String getAllClientes() { return "Lista de clientes"; }
    public String getClienteById(Long id) { return "Cliente con ID: " + id; }
    public String createCliente(String cliente) { return "Cliente creado"; }
    public String updateCliente(Long id, String cliente) { return "Cliente actualizado con ID: " + id; }
    public String deleteCliente(Long id) { return "Cliente eliminado con ID: " + id; }
}
