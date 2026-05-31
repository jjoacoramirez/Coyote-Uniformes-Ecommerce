-- 1. CATEGORÍAS
INSERT INTO categorias (id_categoria, nombre, descripcion) VALUES 
(1, 'Uniformes Médicos', 'Ambos, chaquetas y pantalones para el sector salud y clínicas'),
(2, 'Uniformes Gastronómicos', 'Indumentaria profesional para cocinas, chefs y personal de salón'),
(3, 'Ropa Corporativa', 'Camisas, chombas y pantalones formales para empresas'),
(4, 'Calzado Profesional', 'Zapatos reglamentarios, zuecos sanitarios y calzado de seguridad');

-- 2. PRODUCTOS
INSERT INTO productos (id_producto, id_categoria, nombre, descripcion, precio_base, imagen_url, activo) VALUES 
(1, 1, 'Ambo Médico Spandex Premium', 'Ambo elástico anti-arrugas cuello V', 35000.00, 'https://coyote.com/img/ambo-spandex.jpg', true),
(2, 1, 'Chaqueta Médica Arciel', 'Chaqueta tradicional de tela Arciel certificada', 28000.00, 'https://coyote.com/img/chaqueta-arciel.jpg', true),
(3, 2, 'Chaqueta de Chef Master', 'Chaqueta resistente al calor con botones ocultos', 45000.00, 'https://coyote.com/img/chef-master.jpg', true),
(4, 2, 'Delantal de Jean con Cuero', 'Delantal parrillero y gastronómico de alta costura', 18000.00, 'https://coyote.com/img/delantal-jean.jpg', true),
(5, 3, 'Chomba Piqué Corporativa', 'Chomba de algodón piqué premium para bordado de logo', 22000.00, 'https://coyote.com/img/chomba-pique.jpg', true),
(6, 4, 'Zueco Sanitario Confort', 'Zuecos de goma EVA ergonómicos y antideslizantes', 25000.00, 'https://coyote.com/img/zueco-confort.jpg', true);

-- 3. VARIANTES DE PRODUCTO
INSERT INTO variantes_producto (id_variante, id_producto, talle, color, stock, sku, precio, activo) VALUES 
-- Variantes Ambo Spandex
(1, 1, 'S', 'Azul Marino', 45, 'AMB-SPA-S-AZ', 35000.00, true),
(2, 1, 'M', 'Azul Marino', 60, 'AMB-SPA-M-AZ', 35000.00, true),
(3, 1, 'L', 'Azul Marino', 40, 'AMB-SPA-L-AZ', 35000.00, true),
(4, 1, 'M', 'Negro', 35, 'AMB-SPA-M-NE', 35000.00, true),
(5, 1, 'L', 'Negro', 25, 'AMB-SPA-L-NE', 35000.00, true),
-- Variantes Chaqueta Arciel
(6, 2, 'S', 'Blanco', 30, 'CHA-ARC-S-BL', 28000.00, true),
(7, 2, 'M', 'Blanco', 50, 'CHA-ARC-M-BL', 28000.00, true),
(8, 2, 'L', 'Blanco', 50, 'CHA-ARC-L-BL', 28000.00, true),
(9, 2, 'M', 'Verde Médico', 20, 'CHA-ARC-M-VE', 28000.00, true),
-- Variantes Chef
(10, 3, 'M', 'Blanco', 15, 'CHEF-MAS-M-BL', 45000.00, true),
(11, 3, 'L', 'Blanco', 25, 'CHEF-MAS-L-BL', 45000.00, true),
(12, 3, 'XL', 'Negro', 18, 'CHEF-MAS-XL-NE', 47000.00, true),
-- Variantes Delantal
(13, 4, 'Único', 'Azul Jean', 100, 'DEL-JEA-UN-JE', 18000.00, true),
-- Variantes Chombas
(14, 5, 'M', 'Gris Topo', 80, 'CHO-PIQ-M-GR', 22000.00, true),
(15, 5, 'L', 'Gris Topo', 75, 'CHO-PIQ-L-GR', 22000.00, true),
-- Variantes Zuecos
(16, 6, '38', 'Blanco', 12, 'ZUE-CON-38-BL', 25000.00, true),
(17, 6, '40', 'Blanco', 15, 'ZUE-CON-40-BL', 25000.00, true),
(18, 6, '42', 'Negro', 20, 'ZUE-CON-42-NE', 25000.00, true);

-- 4. USUARIOS (Clave para todos: 123456)
INSERT INTO usuarios (id_usuario, nombre, apellido, email, contrasena, telefono, rol, fecha_registro, estado) VALUES 
(1, 'Soporte', 'Coyote', 'admin@coyoteuniformes.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', '1122334455', 'ADMIN', '2024-01-15', 'ACTIVO'),
(2, 'Juan', 'Pérez', 'juan.perez@email.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', '1122334466', 'USER', '2024-03-10', 'ACTIVO'),
(3, 'María', 'Gómez', 'maria.gomez@email.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', '1133445566', 'USER', '2024-04-01', 'ACTIVO'),
(4, 'Carlos', 'Rodríguez', 'carlos.rod@email.com', '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.', '1144556677', 'USER', '2024-05-20', 'ACTIVO');

-- 5. ADMINISTRADORES
INSERT INTO administradores (id_admin, id_usuario, legajo) VALUES 
(1, 1, 'ADM-001');

-- 6. CLIENTES
INSERT INTO clientes (id_cliente, id_usuario, dni, cuit_cuil, calle, numero, ciudad, provincia, codigo_postal, pais) VALUES 
(1, 2, '35123456', '20-35123456-1', 'Av. Corrientes', '1234', 'CABA', 'Buenos Aires', '1043', 'Argentina'),
(2, 3, '38987654', '27-38987654-3', 'Calle San Martín', '560', 'Rosario', 'Santa Fe', '2000', 'Argentina'),
(3, 4, '40111222', '20-40111222-5', 'Av. Colón', '3200', 'Córdoba', 'Córdoba', '5000', 'Argentina');

-- 7. CARRITOS
INSERT INTO carritos (id_carrito, id_cliente, fecha_creacion, estado) VALUES 
(1, 1, '2026-05-28', 'ACTIVO'),
(2, 2, '2026-05-29', 'ACTIVO'),
(3, 3, '2026-05-29', 'COMPRADO');

-- 8. ITEMS DEL CARRITO
INSERT INTO items_carrito (id_item_carrito, id_carrito, id_variante, cantidad, precio_unitario, subtotal) VALUES 
(1, 1, 2, 2, 35000.00, 70000.00), -- Juan tiene 2 Ambos Spandex M
(2, 1, 16, 1, 25000.00, 25000.00), -- Juan tiene además 1 Zueco 38
(3, 2, 7, 3, 28000.00, 84000.00),  -- María tiene 3 Chaquetas Arciel M
(4, 3, 10, 1, 45000.00, 45000.00); -- Carrito viejo de Carlos

-- 9. HISTORIAL DE PEDIDOS
INSERT INTO pedidos (id_pedido, id_cliente, fecha_pedido, estado, total) VALUES 
(1, 1, '2026-05-20', 'ENTREGADO', 95000.00),
(2, 2, '2026-05-25', 'PROCESANDO', 84000.00),
(3, 3, '2026-05-29', 'PENDIENTE', 45000.00);

-- 10. DETALLES DE PEDIDO
INSERT INTO detalles_pedido (id_detalle_pedido, id_pedido, id_variante, cantidad, precio_unitario, subtotal) VALUES 
(1, 1, 2, 2, 35000.00, 70000.00),
(2, 1, 16, 1, 25000.00, 25000.00),
(3, 2, 7, 3, 28000.00, 84000.00),
(4, 3, 10, 1, 45000.00, 45000.00);

-- 11. HISTORIAL DE PAGOS
INSERT INTO pagos (id_pago, id_pedido, fecha_pago, monto, metodo_pago, estado_pago) VALUES 
(1, 1, '2026-05-20', 95000.00, 'EFECTIVO', 'APROBADO'),
(2, 2, '2026-05-25', 84000.00, 'MERCADO_PAGO', 'APROBADO'),
(3, 3, null, 45000.00, 'TARJETA_CREDITO', 'PENDIENTE');