package com.coyoteuniformes.tienda_online.controllers;

import com.coyoteuniformes.tienda_online.exceptions.AdministradorException;
import com.coyoteuniformes.tienda_online.exceptions.CarritoException;
import com.coyoteuniformes.tienda_online.exceptions.ClienteException;
import com.coyoteuniformes.tienda_online.exceptions.DescuentoException;
import com.coyoteuniformes.tienda_online.exceptions.DetallePedidoException;
import com.coyoteuniformes.tienda_online.exceptions.ItemCarritoException;
import com.coyoteuniformes.tienda_online.exceptions.PedidoException;
import com.coyoteuniformes.tienda_online.exceptions.ProductoException;
import com.coyoteuniformes.tienda_online.exceptions.UsuarioException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            UsuarioException.class,
            ClienteException.class,
            AdministradorException.class,
            PedidoException.class,
            DetallePedidoException.class,
            CarritoException.class,
            ItemCarritoException.class,
            ProductoException.class,
            DescuentoException.class
    })
    public ResponseEntity<Map<String, Object>> handleBusinessException(RuntimeException exception) {
        return buildResponse(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        return buildResponse(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException exception) {
        return buildResponse(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException exception) {
        return buildResponse(HttpStatus.BAD_REQUEST, "No se puede completar la operacion porque el registro esta relacionado con otros datos.");
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthentication(AuthenticationException exception) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpectedException(Exception exception) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ocurrio un error inesperado. Intenta nuevamente mas tarde.");
    }

    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
