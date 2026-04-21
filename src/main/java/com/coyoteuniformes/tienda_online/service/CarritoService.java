package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Carrito;
import com.coyoteuniformes.tienda_online.exceptions.CarritoException;
import com.coyoteuniformes.tienda_online.repository.CarritoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarritoService implements ICarritoService {

    private final CarritoRepository carritoRepository;

    public CarritoService(CarritoRepository carritoRepository) {
        this.carritoRepository = carritoRepository;
    }

    public List<Carrito> getAllCarritos() {
        return carritoRepository.findAll();
    }

    public Optional<Carrito> getCarritoById(Long id) {
        return carritoRepository.findById(id);
    }

    public Carrito createCarrito(Carrito carrito) {
        return carritoRepository.save(carrito);
    }

    public Carrito updateCarrito(Long id, Carrito carrito) {
        Carrito existente = carritoRepository.findById(id)
                .orElseThrow(() -> new CarritoException("Carrito no encontrado con id: " + id));

        existente.setCliente(carrito.getCliente());
        existente.setFechaCreacion(carrito.getFechaCreacion());
        existente.setEstado(carrito.getEstado());

        return carritoRepository.save(existente);
    }

    public void deleteCarrito(Long id) {
        if (!carritoRepository.existsById(id)) {
            throw new CarritoException("Carrito no encontrado con id: " + id);
        }
        carritoRepository.deleteById(id);
    }
}
