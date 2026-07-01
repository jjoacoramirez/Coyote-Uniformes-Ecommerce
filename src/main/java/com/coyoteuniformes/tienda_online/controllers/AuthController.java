package com.coyoteuniformes.tienda_online.controllers;

import com.coyoteuniformes.tienda_online.entity.Usuario;
import com.coyoteuniformes.tienda_online.entity.dto.AuthRequest;
import com.coyoteuniformes.tienda_online.entity.dto.RegisterRequest;
import com.coyoteuniformes.tienda_online.repository.UsuarioRepository;
import com.coyoteuniformes.tienda_online.security.JwtUtil;
import com.coyoteuniformes.tienda_online.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.Duration;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${auth.cookie.secure:false}")
    private boolean secureCookie;

    @Value("${auth.cookie.same-site:Lax}")
    private String sameSite;

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return withAuthCookie(token, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest request) {
        if (usuarioRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
        }

        Usuario usuario = Usuario.builder()
            .nombre(request.getNombre())
            .apellido(request.getApellido())
            .email(request.getEmail().trim().toLowerCase())
            .contrasena(passwordEncoder.encode(request.getContrasena()))
            .rol("ROLE_USER")
            .fechaRegistro(LocalDate.now())
            .estado("activo")
            .build();

        usuarioRepository.save(usuario);

        UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        return withAuthCookie(token, HttpStatus.CREATED);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie cookie = ResponseCookie.from(JwtUtil.COOKIE_NAME, "")
            .httpOnly(true)
            .secure(secureCookie)
            .sameSite(sameSite)
            .path("/")
            .maxAge(Duration.ZERO)
            .build();

        return ResponseEntity.noContent()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .build();
    }

    private ResponseEntity<Void> withAuthCookie(String token, HttpStatus status) {
        ResponseCookie cookie = ResponseCookie.from(JwtUtil.COOKIE_NAME, token)
            .httpOnly(true)
            .secure(secureCookie)
            .sameSite(sameSite)
            .path("/")
            .maxAge(Duration.ofMillis(jwtUtil.getExpiration()))
            .build();

        return ResponseEntity.status(status)
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .build();
    }
}
