package com.coyoteuniformes.tienda_online.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
            .csrf(csfr -> csfr.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                //auth publica
                .requestMatchers("/auth/**").permitAll()

                //Lectura pública de catálogo
                .requestMatchers(HttpMethod.GET, "/categorias/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/productos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/variantes/**").permitAll()

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
                
                //Todos los demas requieren auth
                .anyRequest().authenticated()
            )
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
}
