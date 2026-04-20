package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Pago;
import com.coyoteuniformes.tienda_online.repository.PagoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PagoService implements IPagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Override
    public List<Pago> getAllPagos() {
        return pagoRepository.findAll();
    }

    @Override
    public Optional<Pago> getPagoById(Long id) {
        return pagoRepository.findById(id);
    }

    @Override
    public Pago createPago(Pago pago) {
        return pagoRepository.save(pago);
    }

    @Override
    public Pago updatePago(Long id, Pago pago) {
        if (pagoRepository.existsById(id)) {
            pago.setIdPago(id);
            return pagoRepository.save(pago);
        }
        return null; // O lanzar excepción
    }

    @Override
    public void deletePago(Long id) {
        pagoRepository.deleteById(id);
    }
}
