package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.dto.ClienteDto;

import java.util.List;

public interface IClienteService {
    List<ClienteDto> getAllClientes();
    ClienteDto getClienteById(Long id);
    ClienteDto createCliente(ClienteDto clienteDto);
    ClienteDto updateCliente(Long id, ClienteDto clienteDto);
    void deleteCliente(Long id);
}
