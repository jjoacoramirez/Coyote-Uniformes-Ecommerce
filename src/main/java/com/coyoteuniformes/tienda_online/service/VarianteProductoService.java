package com.coyoteuniformes.tienda_online.service;

import org.springframework.stereotype.Service;

@Service
public class VarianteProductoService implements IVarianteProductoService {

    public String getAllVariantes() { return "Lista de variantes"; }
    public String getVarianteById(Long id) { return "Variante con ID: " + id; }
    public String createVariante(String variante) { return "Variante creada"; }
    public String updateVariante(Long id, String variante) { return "Variante actualizada con ID: " + id; }
    public String deleteVariante(Long id) { return "Variante eliminada con ID: " + id; }
}
