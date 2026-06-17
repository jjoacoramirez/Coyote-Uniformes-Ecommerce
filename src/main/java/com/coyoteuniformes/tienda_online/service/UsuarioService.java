package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Cliente;
import com.coyoteuniformes.tienda_online.entity.Usuario;
import com.coyoteuniformes.tienda_online.entity.dto.CambiarPasswordDto;
import com.coyoteuniformes.tienda_online.entity.dto.PerfilUpdateDto;
import com.coyoteuniformes.tienda_online.entity.dto.UsuarioDto;
import com.coyoteuniformes.tienda_online.exceptions.UsuarioException;
import com.coyoteuniformes.tienda_online.repository.ClienteRepository;
import com.coyoteuniformes.tienda_online.repository.UsuarioRepository;
import com.coyoteuniformes.tienda_online.service.support.UsuarioRoles;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class UsuarioService implements IUsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, ClienteRepository clienteRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioDto> getAllUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioDto getUsuarioById(Long id) {
        return toDto(findUsuarioById(id));
    }

    @Override
    public UsuarioDto createUsuario(UsuarioDto usuarioDto) {
        String email = normalizeEmail(usuarioDto.getEmail());
        String rol = normalizeRol(usuarioDto.getRol());

        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new UsuarioException("Ya existe un usuario con el email " + email);
        }

        Usuario usuario = Usuario.builder()
                .nombre(normalizeRequired(usuarioDto.getNombre(), "El nombre es obligatorio"))
                .apellido(normalizeRequired(usuarioDto.getApellido(), "El apellido es obligatorio"))
                .email(email)
                .contrasena(passwordEncoder.encode(usuarioDto.getContrasena().trim()))
                .telefono(normalizeOptional(usuarioDto.getTelefono()))
                .rol(rol)
                .fechaRegistro(usuarioDto.getFechaRegistro() != null ? usuarioDto.getFechaRegistro() : LocalDate.now())
                .estado(normalizeEstado(usuarioDto.getEstado()))
                .build();

        return toDto(usuarioRepository.save(usuario));
    }

    @Override
    public UsuarioDto updateUsuario(Long id, UsuarioDto usuarioDto) {
        Usuario usuario = findUsuarioById(id);
        String email = normalizeEmail(usuarioDto.getEmail());
        String rol = normalizeRol(usuarioDto.getRol());

        if (usuarioRepository.existsByEmailIgnoreCaseAndIdUsuarioNot(email, id)) {
            throw new UsuarioException("Ya existe un usuario con el email " + email);
        }

        if (usuario.getCliente() != null && !UsuarioRoles.CLIENTE.equals(rol)) {
            throw new UsuarioException("El usuario tiene un perfil de cliente y su rol debe seguir siendo CLIENTE");
        }

        if (usuario.getAdministrador() != null && !UsuarioRoles.ADMINISTRADOR.equals(rol)) {
            throw new UsuarioException("El usuario tiene un perfil de administrador y su rol debe seguir siendo ADMINISTRADOR");
        }

        usuario.setNombre(normalizeRequired(usuarioDto.getNombre(), "El nombre es obligatorio"));
        usuario.setApellido(normalizeRequired(usuarioDto.getApellido(), "El apellido es obligatorio"));
        usuario.setEmail(email);
        usuario.setContrasena(passwordEncoder.encode(usuarioDto.getContrasena().trim()));
        usuario.setTelefono(normalizeOptional(usuarioDto.getTelefono()));
        usuario.setRol(rol);
        usuario.setEstado(normalizeEstado(usuarioDto.getEstado()));

        return toDto(usuarioRepository.save(usuario));
    }

    @Override
    public void deleteUsuario(Long id) {
        Usuario usuario = findUsuarioById(id);

        if (usuario.getCliente() != null) {
            throw new UsuarioException("No se puede eliminar el usuario porque tiene un perfil de cliente asociado");
        }

        if (usuario.getAdministrador() != null) {
            throw new UsuarioException("No se puede eliminar el usuario porque tiene un perfil de administrador asociado");
        }

        usuarioRepository.delete(usuario);
    }

    @Transactional(readOnly = true)
    public UsuarioDto getPerfilByEmail(String email) {
        return toDto(findUsuarioByEmail(email));
    }

    public UsuarioDto updatePerfilByEmail(String email, PerfilUpdateDto dto) {
        Usuario usuario = findUsuarioByEmail(email);
        if (StringUtils.hasText(dto.getNombre())) usuario.setNombre(dto.getNombre().trim());
        if (StringUtils.hasText(dto.getApellido())) usuario.setApellido(dto.getApellido().trim());
        usuario.setTelefono(normalizeOptional(dto.getTelefono()));

        if (Boolean.TRUE.equals(dto.getActualizarDireccion())) {
            Cliente cliente = resolveClienteParaDireccion(usuario, dto);
            if (cliente != null) {
                cliente.setCalle(normalizeOptional(dto.getCalle()));
                cliente.setNumero(normalizeOptional(dto.getNumero()));
                cliente.setCiudad(normalizeOptional(dto.getCiudad()));
                cliente.setProvincia(normalizeOptional(dto.getProvincia()));
                cliente.setCodigoPostal(normalizeOptional(dto.getCodigoPostal()));
                cliente.setPais(normalizeOptional(dto.getPais()));
                clienteRepository.save(cliente);
                usuario.setCliente(cliente);
            }
        }

        return toDto(usuarioRepository.save(usuario));
    }

    public void cambiarPassword(String email, CambiarPasswordDto dto) {
        Usuario usuario = findUsuarioByEmail(email);
        if (!passwordEncoder.matches(dto.getContrasenaActual(), usuario.getContrasena())) {
            throw new UsuarioException("La contraseña actual es incorrecta");
        }
        if (!StringUtils.hasText(dto.getContrasenaNueva()) || dto.getContrasenaNueva().trim().length() < 6) {
            throw new UsuarioException("La nueva contraseña debe tener al menos 6 caracteres");
        }
        usuario.setContrasena(passwordEncoder.encode(dto.getContrasenaNueva().trim()));
        usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario findUsuarioById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioException("No existe un usuario con ID " + id));
    }

    private Usuario findUsuarioByEmail(String email) {
        return usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UsuarioException("No existe un usuario con el email " + email));
    }

    private UsuarioDto toDto(Usuario usuario) {
        return UsuarioDto.builder()
                .idUsuario(usuario.getIdUsuario())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .email(usuario.getEmail())
                .contrasena(null)
                .telefono(usuario.getTelefono())
                .rol(usuario.getRol())
                .fechaRegistro(usuario.getFechaRegistro())
                .estado(usuario.getEstado())
                .idCliente(usuario.getCliente() != null ? usuario.getCliente().getIdCliente() : null)
                .calle(usuario.getCliente() != null ? usuario.getCliente().getCalle() : null)
                .numero(usuario.getCliente() != null ? usuario.getCliente().getNumero() : null)
                .ciudad(usuario.getCliente() != null ? usuario.getCliente().getCiudad() : null)
                .provincia(usuario.getCliente() != null ? usuario.getCliente().getProvincia() : null)
                .codigoPostal(usuario.getCliente() != null ? usuario.getCliente().getCodigoPostal() : null)
                .pais(usuario.getCliente() != null ? usuario.getCliente().getPais() : null)
                .build();
    }

    private Cliente resolveClienteParaDireccion(Usuario usuario, PerfilUpdateDto dto) {
        if (!tieneDatosDireccion(dto)) {
            return usuario.getCliente();
        }

        if (usuario.getCliente() != null) {
            return usuario.getCliente();
        }

        return Cliente.builder()
                .usuario(usuario)
                .build();
    }

    private boolean tieneDatosDireccion(PerfilUpdateDto dto) {
        return StringUtils.hasText(dto.getCalle())
                || StringUtils.hasText(dto.getNumero())
                || StringUtils.hasText(dto.getCiudad())
                || StringUtils.hasText(dto.getProvincia())
                || StringUtils.hasText(dto.getCodigoPostal())
                || StringUtils.hasText(dto.getPais());
    }

    private String normalizeEmail(String email) {
        String normalizedEmail = normalizeRequired(email, "El email es obligatorio").toLowerCase();
        if (!normalizedEmail.contains("@")) {
            throw new UsuarioException("El email no es valido");
        }
        return normalizedEmail;
    }

    private String normalizeRol(String rol) {
        String normalizedRol = normalizeRequired(rol, "El rol es obligatorio").toUpperCase();
        if (!UsuarioRoles.CLIENTE.equals(normalizedRol) && !UsuarioRoles.ADMINISTRADOR.equals(normalizedRol)) {
            throw new UsuarioException("El rol debe ser CLIENTE o ADMINISTRADOR");
        }
        return normalizedRol;
    }

    private String normalizeEstado(String estado) {
        String normalizedEstado = normalizeOptional(estado);
        return StringUtils.hasText(normalizedEstado) ? normalizedEstado.toUpperCase() : UsuarioRoles.ACTIVO;
    }

    private String normalizeRequired(String value, String message) {
        if (!StringUtils.hasText(value)) {
            throw new UsuarioException(message);
        }
        return value.trim();
    }

    private String normalizeOptional(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
