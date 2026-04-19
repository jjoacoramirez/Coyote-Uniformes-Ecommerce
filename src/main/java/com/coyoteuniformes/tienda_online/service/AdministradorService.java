package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Administrador;
import com.coyoteuniformes.tienda_online.entity.Usuario;
import com.coyoteuniformes.tienda_online.entity.dto.AdministradorDto;
import com.coyoteuniformes.tienda_online.exceptions.AdministradorException;
import com.coyoteuniformes.tienda_online.repository.AdministradorRepository;
import com.coyoteuniformes.tienda_online.repository.ClienteRepository;
import com.coyoteuniformes.tienda_online.service.support.UsuarioRoles;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@Transactional
public class AdministradorService implements IAdministradorService {

    private final AdministradorRepository administradorRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioService usuarioService;

    public AdministradorService(
            AdministradorRepository administradorRepository,
            ClienteRepository clienteRepository,
            UsuarioService usuarioService
    ) {
        this.administradorRepository = administradorRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioService = usuarioService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdministradorDto> getAllAdministradores() {
        return administradorRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdministradorDto getAdministradorById(Long id) {
        return toDto(findAdministradorById(id));
    }

    @Override
    public AdministradorDto createAdministrador(AdministradorDto administradorDto) {
        Usuario usuario = validateUsuarioAdministrador(administradorDto.getIdUsuario(), null);
        validateUniqueLegajo(administradorDto.getLegajo(), null);

        Administrador administrador = Administrador.builder()
                .usuario(usuario)
                .legajo(normalizeRequired(administradorDto.getLegajo(), "El legajo es obligatorio"))
                .build();

        return toDto(administradorRepository.save(administrador));
    }

    @Override
    public AdministradorDto updateAdministrador(Long id, AdministradorDto administradorDto) {
        Administrador administrador = findAdministradorById(id);
        Usuario usuario = validateUsuarioAdministrador(administradorDto.getIdUsuario(), id);
        validateUniqueLegajo(administradorDto.getLegajo(), id);

        administrador.setUsuario(usuario);
        administrador.setLegajo(normalizeRequired(administradorDto.getLegajo(), "El legajo es obligatorio"));

        return toDto(administradorRepository.save(administrador));
    }

    @Override
    public void deleteAdministrador(Long id) {
        administradorRepository.delete(findAdministradorById(id));
    }

    @Transactional(readOnly = true)
    public Administrador findAdministradorById(Long id) {
        return administradorRepository.findById(id)
                .orElseThrow(() -> new AdministradorException("No existe un administrador con ID " + id));
    }

    private Usuario validateUsuarioAdministrador(Long idUsuario, Long adminId) {
        Usuario usuario = usuarioService.findUsuarioById(idUsuario);

        if (!UsuarioRoles.ADMINISTRADOR.equalsIgnoreCase(usuario.getRol())) {
            throw new AdministradorException("El usuario indicado no tiene rol ADMINISTRADOR");
        }

        boolean usuarioYaAsociado = adminId == null
                ? administradorRepository.existsByUsuarioIdUsuario(idUsuario)
                : administradorRepository.existsByUsuarioIdUsuarioAndIdAdminNot(idUsuario, adminId);

        if (usuarioYaAsociado) {
            throw new AdministradorException("El usuario indicado ya esta asociado a otro administrador");
        }

        if (clienteRepository.existsByUsuarioIdUsuario(idUsuario)) {
            throw new AdministradorException("El usuario indicado ya esta asociado a un cliente");
        }

        return usuario;
    }

    private void validateUniqueLegajo(String legajo, Long adminId) {
        String normalizedLegajo = normalizeRequired(legajo, "El legajo es obligatorio");

        boolean legajoDuplicado = adminId == null
                ? administradorRepository.existsByLegajo(normalizedLegajo)
                : administradorRepository.existsByLegajoAndIdAdminNot(normalizedLegajo, adminId);

        if (legajoDuplicado) {
            throw new AdministradorException("Ya existe un administrador con el legajo " + normalizedLegajo);
        }
    }

    private AdministradorDto toDto(Administrador administrador) {
        return AdministradorDto.builder()
                .idAdmin(administrador.getIdAdmin())
                .idUsuario(administrador.getUsuario().getIdUsuario())
                .legajo(administrador.getLegajo())
                .build();
    }

    private String normalizeRequired(String value, String message) {
        if (!StringUtils.hasText(value)) {
            throw new AdministradorException(message);
        }
        return value.trim();
    }
}
