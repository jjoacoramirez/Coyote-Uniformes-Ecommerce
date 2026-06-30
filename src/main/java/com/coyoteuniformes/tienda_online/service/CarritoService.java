package com.coyoteuniformes.tienda_online.service;

import com.coyoteuniformes.tienda_online.entity.Carrito;
import com.coyoteuniformes.tienda_online.entity.Cliente;
import com.coyoteuniformes.tienda_online.entity.Descuento;
import com.coyoteuniformes.tienda_online.entity.TipoDescuento;
import com.coyoteuniformes.tienda_online.entity.ItemCarrito;
import com.coyoteuniformes.tienda_online.entity.Pago;
import com.coyoteuniformes.tienda_online.entity.Pedido;
import com.coyoteuniformes.tienda_online.entity.Producto;
import com.coyoteuniformes.tienda_online.entity.DetallePedido;
import com.coyoteuniformes.tienda_online.entity.Usuario;
import com.coyoteuniformes.tienda_online.entity.VarianteProducto;
import com.coyoteuniformes.tienda_online.entity.dto.CartDto;
import com.coyoteuniformes.tienda_online.entity.dto.CartItemDto;
import com.coyoteuniformes.tienda_online.entity.dto.CartItemRequestDto;
import com.coyoteuniformes.tienda_online.entity.dto.CheckoutRequestDto;
import com.coyoteuniformes.tienda_online.entity.dto.CheckoutResponseDto;
import com.coyoteuniformes.tienda_online.exceptions.CarritoException;
import com.coyoteuniformes.tienda_online.repository.CarritoRepository;
import com.coyoteuniformes.tienda_online.repository.ClienteRepository;
import com.coyoteuniformes.tienda_online.repository.DetallePedidoRepository;
import com.coyoteuniformes.tienda_online.repository.ItemCarritoRepository;
import com.coyoteuniformes.tienda_online.repository.PagoRepository;
import com.coyoteuniformes.tienda_online.repository.PedidoRepository;
import com.coyoteuniformes.tienda_online.repository.UsuarioRepository;
import com.coyoteuniformes.tienda_online.repository.VarianteProductoRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CarritoService implements ICarritoService {

    private final CarritoRepository carritoRepository;
    private final ClienteRepository clienteRepository;
    private final DetallePedidoRepository detallePedidoRepository;
    private final ItemCarritoRepository itemCarritoRepository;
    private final PagoRepository pagoRepository;
    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final VarianteProductoRepository varianteProductoRepository;
    private final DescuentoService descuentoService;

    public CarritoService(
            CarritoRepository carritoRepository,
            ClienteRepository clienteRepository,
            DetallePedidoRepository detallePedidoRepository,
            ItemCarritoRepository itemCarritoRepository,
            PagoRepository pagoRepository,
            PedidoRepository pedidoRepository,
            UsuarioRepository usuarioRepository,
            VarianteProductoRepository varianteProductoRepository,
            DescuentoService descuentoService
    ) {
        this.carritoRepository = carritoRepository;
        this.clienteRepository = clienteRepository;
        this.detallePedidoRepository = detallePedidoRepository;
        this.itemCarritoRepository = itemCarritoRepository;
        this.pagoRepository = pagoRepository;
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.varianteProductoRepository = varianteProductoRepository;
        this.descuentoService = descuentoService;
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

    @Transactional
    public CartDto getCarritoActual(String email) {
        return toDto(getOrCreateCarritoActivo(email));
    }

    @Transactional
    public CartDto agregarItem(String email, CartItemRequestDto request) {
        if (request.getIdVariante() == null) {
            throw new CarritoException("La variante es obligatoria");
        }

        int cantidad = normalizeCantidad(request.getCantidad());
        Carrito carrito = getOrCreateCarritoActivo(email);
        VarianteProducto variante = varianteProductoRepository.findById(request.getIdVariante())
                .orElseThrow(() -> new CarritoException("Variante no encontrada con id: " + request.getIdVariante()));

        ItemCarrito item = itemCarritoRepository
                .findByCarritoIdCarritoAndVarianteIdVariante(carrito.getIdCarrito(), variante.getIdVariante())
                .orElseGet(() -> ItemCarrito.builder()
                        .carrito(carrito)
                        .variante(variante)
                        .cantidad(0)
                        .precioUnitario(getPrecioVariante(variante))
                        .build());

        item.setCantidad(item.getCantidad() + cantidad);
        item.setPrecioUnitario(getPrecioVariante(variante));
        itemCarritoRepository.save(item);

        return toDto(carrito);
    }

    @Transactional
    public CartDto actualizarItem(String email, Long idItem, CartItemRequestDto request) {
        Carrito carrito = getOrCreateCarritoActivo(email);
        ItemCarrito item = itemCarritoRepository.findById(idItem)
                .orElseThrow(() -> new CarritoException("Item de carrito no encontrado con id: " + idItem));
        validarItemDelCarrito(item, carrito);

        item.setCantidad(normalizeCantidad(request.getCantidad()));
        item.setPrecioUnitario(getPrecioVariante(item.getVariante()));
        itemCarritoRepository.save(item);

        return toDto(carrito);
    }

    @Transactional
    public CartDto eliminarItem(String email, Long idItem) {
        Carrito carrito = getOrCreateCarritoActivo(email);
        ItemCarrito item = itemCarritoRepository.findById(idItem)
                .orElseThrow(() -> new CarritoException("Item de carrito no encontrado con id: " + idItem));
        validarItemDelCarrito(item, carrito);
        itemCarritoRepository.delete(item);
        return toDto(carrito);
    }

    @Transactional
    public CartDto vaciarCarritoActual(String email) {
        Carrito carrito = getOrCreateCarritoActivo(email);
        itemCarritoRepository.deleteByCarritoIdCarrito(carrito.getIdCarrito());
        return toDto(carrito);
    }

    @Transactional
    public CheckoutResponseDto checkout(String email, CheckoutRequestDto request) {
        Carrito carrito = getOrCreateCarritoActivo(email);
        List<ItemCarrito> items = itemCarritoRepository.findByCarritoIdCarrito(carrito.getIdCarrito());
        if (items.isEmpty()) {
            throw new CarritoException("El carrito esta vacio");
        }

        BigDecimal subtotal = items.stream()
                .map(item -> item.getSubtotal() == null ? BigDecimal.ZERO : item.getSubtotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Aplica el cupón (si vino): descuenta del total y registra el uso.
        BigDecimal total = subtotal;
        if (request.getCodigoDescuento() != null && !request.getCodigoDescuento().isBlank()) {
            BigDecimal descuento = calcularDescuento(request.getCodigoDescuento(), subtotal);
            total = subtotal.subtract(descuento);
            if (total.signum() < 0) {
                total = BigDecimal.ZERO;
            }
            descuentoService.registrarUso(request.getCodigoDescuento());
        }

        // IVA 21% sobre el neto (subtotal - descuento).
        BigDecimal iva = total.multiply(BigDecimal.valueOf(0.21)).setScale(0, RoundingMode.HALF_UP);
        total = total.add(iva);

        Pedido pedido = pedidoRepository.save(Pedido.builder()
                .idCliente(carrito.getCliente().getIdCliente())
                .fechaPedido(LocalDate.now())
                .estado("CONFIRMADO")
                .total(total)
                .build());

        for (ItemCarrito item : items) {
            detallePedidoRepository.save(DetallePedido.builder()
                    .idPedido(pedido.getIdPedido())
                    .idVariante(item.getVariante().getIdVariante())
                    .cantidad(item.getCantidad())
                    .precioUnitario(item.getPrecioUnitario())
                    .subtotal(item.getSubtotal())
                    .build());
        }

        Pago pago = pagoRepository.save(Pago.builder()
                .pedido(pedido)
                .fechaPago(LocalDate.now())
                .monto(total)
                .metodoPago(normalizeMetodoPago(request.getMetodoPago()))
                .estadoPago("APROBADO")
                .build());

        itemCarritoRepository.deleteByCarritoIdCarrito(carrito.getIdCarrito());
        carrito.setEstado("FINALIZADO");
        carritoRepository.save(carrito);

        return CheckoutResponseDto.builder()
                .idPedido(pedido.getIdPedido())
                .idPago(pago.getIdPago())
                .estadoPedido(pedido.getEstado())
                .estadoPago(pago.getEstadoPago())
                .total(total)
                .build();
    }

    private BigDecimal calcularDescuento(String codigo, BigDecimal subtotal) {
        Descuento descuento = descuentoService.validarDescuento(codigo);
        BigDecimal minimo = descuento.getMontoMinimo() != null ? descuento.getMontoMinimo() : BigDecimal.ZERO;
        if (subtotal.compareTo(minimo) < 0) {
            throw new CarritoException("El cupón requiere una compra mínima de " + minimo);
        }
        if (descuento.getTipo() == TipoDescuento.PORCENTAJE) {
            return subtotal.multiply(descuento.getValor())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }
        return descuento.getValor().min(subtotal);
    }

    private Carrito getOrCreateCarritoActivo(String email) {
        Cliente cliente = clienteRepository.findByUsuarioEmailIgnoreCase(email)
                .orElseGet(() -> crearClienteParaUsuario(email));

        return carritoRepository
                .findFirstByClienteIdClienteAndEstadoIgnoreCaseOrderByIdCarritoDesc(cliente.getIdCliente(), "ACTIVO")
                .orElseGet(() -> carritoRepository.save(Carrito.builder()
                        .cliente(cliente)
                        .fechaCreacion(LocalDate.now())
                        .estado("ACTIVO")
                        .build()));
    }

    private Cliente crearClienteParaUsuario(String email) {
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new CarritoException("Usuario autenticado no encontrado"));

        String rol = String.valueOf(usuario.getRol()).trim().toUpperCase();
        boolean esCliente = rol.equals("ROLE_USER") || rol.equals("USER") || rol.equals("USUARIO") || rol.equals("CLIENTE");

        if (!esCliente) {
            throw new CarritoException("Solo los usuarios cliente pueden tener carrito");
        }

        return clienteRepository.save(Cliente.builder()
                .usuario(usuario)
                .build());
    }

    private CartDto toDto(Carrito carrito) {
        List<CartItemDto> items = itemCarritoRepository.findByCarritoIdCarrito(carrito.getIdCarrito())
                .stream()
                .map(this::toItemDto)
                .toList();

        BigDecimal subtotal = items.stream()
                .map(item -> item.getSubtotal() == null ? BigDecimal.ZERO : item.getSubtotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int totalItems = items.stream()
                .mapToInt(item -> item.getCantidad() == null ? 0 : item.getCantidad())
                .sum();

        return CartDto.builder()
                .idCarrito(carrito.getIdCarrito())
                .estado(carrito.getEstado())
                .fechaCreacion(carrito.getFechaCreacion())
                .items(items)
                .totalItems(totalItems)
                .subtotal(subtotal)
                .build();
    }

    private CartItemDto toItemDto(ItemCarrito item) {
        VarianteProducto variante = item.getVariante();
        Producto producto = variante.getProducto();
        String categoriaNombre = producto.getCategoria() == null ? null : producto.getCategoria().getNombre();

        return CartItemDto.builder()
                .idItemCarrito(item.getIdItemCarrito())
                .idVariante(variante.getIdVariante())
                .cantidad(item.getCantidad())
                .precioUnitario(item.getPrecioUnitario())
                .subtotal(item.getSubtotal())
                .idProducto(producto.getIdProducto())
                .productoNombre(producto.getNombre())
                .productoImagenUrl(producto.getImagenUrl())
                .categoriaNombre(categoriaNombre)
                .talle(variante.getTalle())
                .color(variante.getColor())
                .build();
    }

    private BigDecimal getPrecioVariante(VarianteProducto variante) {
        if (variante.getPrecio() != null) {
            return variante.getPrecio();
        }
        return variante.getProducto().getPrecioBase();
    }

    private int normalizeCantidad(Integer cantidad) {
        return Math.max(1, cantidad == null ? 1 : cantidad);
    }

    private String normalizeMetodoPago(String metodoPago) {
        if (metodoPago == null || metodoPago.trim().isEmpty()) {
            return "Mercado Pago";
        }
        return metodoPago.trim();
    }

    private void validarItemDelCarrito(ItemCarrito item, Carrito carrito) {
        if (!item.getCarrito().getIdCarrito().equals(carrito.getIdCarrito())) {
            throw new CarritoException("El item no pertenece al carrito del usuario autenticado");
        }
    }
}
