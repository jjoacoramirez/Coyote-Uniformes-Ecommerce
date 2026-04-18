package com.coyoteuniformes.tienda_online.service;

public interface IClienteService {
    String getAllClientes();
    String getClienteById(Long id);
    String createCliente(String cliente);
    String updateCliente(Long id, String cliente);
    String deleteCliente(Long id);
}
