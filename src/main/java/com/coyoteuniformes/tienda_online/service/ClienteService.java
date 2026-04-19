package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Cliente;
import com.coyoteuniformes.tienda_online.entity.Usuario;
import com.coyoteuniformes.tienda_online.entity.dto.ClienteDto;
import com.coyoteuniformes.tienda_online.exceptions.ClienteException;
import com.coyoteuniformes.tienda_online.repository.AdministradorRepository;
import com.coyoteuniformes.tienda_online.repository.ClienteRepository;
import com.coyoteuniformes.tienda_online.service.support.UsuarioRoles;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@Transactional
public class ClienteService implements IClienteService {

    private final ClienteRepository clienteRepository;
    private final AdministradorRepository administradorRepository;
    private final UsuarioService usuarioService;

    public ClienteService(
            ClienteRepository clienteRepository,
            AdministradorRepository administradorRepository,
            UsuarioService usuarioService
    ) {
        this.clienteRepository = clienteRepository;
        this.administradorRepository = administradorRepository;
        this.usuarioService = usuarioService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteDto> getAllClientes() {
        return clienteRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteDto getClienteById(Long id) {
        return toDto(findClienteById(id));
    }

    @Override
    public ClienteDto createCliente(ClienteDto clienteDto) {
        Usuario usuario = validateUsuarioCliente(clienteDto.getIdUsuario(), null);
        validateUniqueDni(clienteDto.getDni(), null);

        Cliente cliente = Cliente.builder()
                .usuario(usuario)
                .dni(normalizeOptional(clienteDto.getDni()))
                .cuitCuil(normalizeOptional(clienteDto.getCuitCuil()))
                .calle(normalizeOptional(clienteDto.getCalle()))
                .numero(normalizeOptional(clienteDto.getNumero()))
                .ciudad(normalizeOptional(clienteDto.getCiudad()))
                .provincia(normalizeOptional(clienteDto.getProvincia()))
                .codigoPostal(normalizeOptional(clienteDto.getCodigoPostal()))
                .pais(normalizeOptional(clienteDto.getPais()))
                .build();

        return toDto(clienteRepository.save(cliente));
    }

    @Override
    public ClienteDto updateCliente(Long id, ClienteDto clienteDto) {
        Cliente cliente = findClienteById(id);
        Usuario usuario = validateUsuarioCliente(clienteDto.getIdUsuario(), id);
        validateUniqueDni(clienteDto.getDni(), id);

        cliente.setUsuario(usuario);
        cliente.setDni(normalizeOptional(clienteDto.getDni()));
        cliente.setCuitCuil(normalizeOptional(clienteDto.getCuitCuil()));
        cliente.setCalle(normalizeOptional(clienteDto.getCalle()));
        cliente.setNumero(normalizeOptional(clienteDto.getNumero()));
        cliente.setCiudad(normalizeOptional(clienteDto.getCiudad()));
        cliente.setProvincia(normalizeOptional(clienteDto.getProvincia()));
        cliente.setCodigoPostal(normalizeOptional(clienteDto.getCodigoPostal()));
        cliente.setPais(normalizeOptional(clienteDto.getPais()));

        return toDto(clienteRepository.save(cliente));
    }

    @Override
    public void deleteCliente(Long id) {
        clienteRepository.delete(findClienteById(id));
    }

    @Transactional(readOnly = true)
    public Cliente findClienteById(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ClienteException("No existe un cliente con ID " + id));
    }

    private Usuario validateUsuarioCliente(Long idUsuario, Long clienteId) {
        Usuario usuario = usuarioService.findUsuarioById(idUsuario);

        if (!UsuarioRoles.CLIENTE.equalsIgnoreCase(usuario.getRol())) {
            throw new ClienteException("El usuario indicado no tiene rol CLIENTE");
        }

        boolean usuarioYaAsociado = clienteId == null
                ? clienteRepository.existsByUsuarioIdUsuario(idUsuario)
                : clienteRepository.existsByUsuarioIdUsuarioAndIdClienteNot(idUsuario, clienteId);

        if (usuarioYaAsociado) {
            throw new ClienteException("El usuario indicado ya esta asociado a otro cliente");
        }

        if (administradorRepository.existsByUsuarioIdUsuario(idUsuario)) {
            throw new ClienteException("El usuario indicado ya esta asociado a un administrador");
        }

        return usuario;
    }

    private void validateUniqueDni(String dni, Long clienteId) {
        String normalizedDni = normalizeOptional(dni);
        if (!StringUtils.hasText(normalizedDni)) {
            return;
        }

        boolean dniDuplicado = clienteId == null
                ? clienteRepository.existsByDni(normalizedDni)
                : clienteRepository.existsByDniAndIdClienteNot(normalizedDni, clienteId);

        if (dniDuplicado) {
            throw new ClienteException("Ya existe un cliente con el DNI " + normalizedDni);
        }
    }

    private ClienteDto toDto(Cliente cliente) {
        return ClienteDto.builder()
                .idCliente(cliente.getIdCliente())
                .idUsuario(cliente.getUsuario().getIdUsuario())
                .dni(cliente.getDni())
                .cuitCuil(cliente.getCuitCuil())
                .calle(cliente.getCalle())
                .numero(cliente.getNumero())
                .ciudad(cliente.getCiudad())
                .provincia(cliente.getProvincia())
                .codigoPostal(cliente.getCodigoPostal())
                .pais(cliente.getPais())
                .build();
    }

    private String normalizeOptional(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
