package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.ItemCarrito;
import com.coyoteuniformes.tienda_online.exceptions.ItemCarritoException;
import com.coyoteuniformes.tienda_online.repository.ItemCarritoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemCarritoService implements IItemCarritoService {

    private final ItemCarritoRepository itemCarritoRepository;

    public ItemCarritoService(ItemCarritoRepository itemCarritoRepository) {
        this.itemCarritoRepository = itemCarritoRepository;
    }

    public List<ItemCarrito> getAllItemsCarrito() {
        return itemCarritoRepository.findAll();
    }

    public Optional<ItemCarrito> getItemCarritoById(Long id) {
        return itemCarritoRepository.findById(id);
    }

    public ItemCarrito createItemCarrito(ItemCarrito itemCarrito) {
        return itemCarritoRepository.save(itemCarrito);
    }

    public ItemCarrito updateItemCarrito(Long id, ItemCarrito itemCarrito) {
        ItemCarrito existente = itemCarritoRepository.findById(id)
                .orElseThrow(() -> new ItemCarritoException("Item de carrito no encontrado con id: " + id));

        existente.setCarrito(itemCarrito.getCarrito());
        existente.setVariante(itemCarrito.getVariante());
        existente.setCantidad(itemCarrito.getCantidad());
        existente.setPrecioUnitario(itemCarrito.getPrecioUnitario());

        return itemCarritoRepository.save(existente);
    }

    public void deleteItemCarrito(Long id) {
        if (!itemCarritoRepository.existsById(id)) {
            throw new ItemCarritoException("Item de carrito no encontrado con id: " + id);
        }
        itemCarritoRepository.deleteById(id);
    }
}
