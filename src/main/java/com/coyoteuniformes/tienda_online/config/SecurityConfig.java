package com.coyoteuniformes.tienda_online.config;

import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.coyoteuniformes.tienda_online.security.JwtAuthFilter;
import com.coyoteuniformes.tienda_online.security.UserDetailsServiceImpl;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csfr -> csfr.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                //auth publica
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/error").permitAll()

                //Lectura pública de catálogo
                .requestMatchers(HttpMethod.GET, "/categorias/admin").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/categorias", "/categorias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/productos/admin").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/productos", "/productos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/variantes", "/variantes/**").permitAll()

                //ABM de catálogo → solo ADMIN
                .requestMatchers(HttpMethod.POST, "/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/categorias/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/variantes/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/variantes/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/variantes/**").hasRole("ADMIN")
                
                //Perfil propio → cualquier usuario autenticado
                .requestMatchers(HttpMethod.GET, "/usuarios/me").authenticated()
                .requestMatchers(HttpMethod.PUT, "/usuarios/me").authenticated()
                .requestMatchers(HttpMethod.PUT, "/usuarios/me/password").authenticated()

                //Gestión de usuarios/admins/clientes → solo ADMIN
                .requestMatchers("/usuarios/**").hasRole("ADMIN")
                .requestMatchers("/administradores/**").hasRole("ADMIN")
                .requestMatchers("/clientes/**").hasRole("ADMIN")

                // Carrito e items → USER y ADMIN (el usuario maneja su propio carrito)
                .requestMatchers("/carritos/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/items-carrito/**").hasAnyRole("USER", "ADMIN")

                // Pedidos → USER puede crear y ver, solo ADMIN puede modificar o eliminar
                .requestMatchers(HttpMethod.GET,    "/pedidos/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.POST,   "/pedidos/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/pedidos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/pedidos/**").hasRole("ADMIN")

                // Descuentos: validar es público, ABM solo ADMIN
                .requestMatchers(HttpMethod.GET, "/descuentos/validar/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/descuentos", "/descuentos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/descuentos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/descuentos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/descuentos/**").hasRole("ADMIN")

                // Detalles y pagos → solo lectura para USER, escritura solo ADMIN
                .requestMatchers(HttpMethod.GET,    "/detalles-pedido/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.POST,   "/detalles-pedido/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/detalles-pedido/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/detalles-pedido/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,    "/pagos/**").hasAnyRole("USER", "ADMIN")
                .requestMatchers(HttpMethod.POST,   "/pagos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/pagos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/pagos/**").hasRole("ADMIN")

                //Todos los demas requieren auth
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) ->
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"))
                .accessDeniedHandler((request, response, accessDeniedException) ->
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden")))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
