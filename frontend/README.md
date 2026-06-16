# Coyote Uniformes Ecommerce

Proyecto web de ecommerce para **Coyote Uniformes**, orientado a la venta y gestión de uniformes.

En esta etapa se desarrolló principalmente el **frontend con React**, incluyendo navegación entre vistas, catálogo de productos, carrito de compras, login y vistas de administración.  
El proyecto también cuenta con un backend desarrollado con **Spring Boot**, utilizado como API para la gestión de datos.

---

## Tecnologías principales

- React
- Vite
- React Router
- CSS
- Spring Boot
- Maven

---

## Estructura general del proyecto

CoyoteUniformes/
│
├── frontend/          # Aplicación frontend en React
│
├── src/               # Código fuente del backend Spring Boot
│
├── pom.xml            # Configuración de Maven
│
├── mvnw.cmd           # Wrapper de Maven para Windows
│
└── README.md
Cómo ejecutar el frontend

Primero ingresar a la carpeta del frontend:

cd frontend

Instalar las dependencias:

npm install

Levantar el servidor de desarrollo:

npm run dev

Luego abrir en el navegador:

http://localhost:5173
Cómo ejecutar el backend

Desde la raíz del proyecto, ejecutar:

mvnw.cmd spring-boot:run

La API queda disponible en:

http://localhost:8080/api
Vistas principales del frontend

El frontend incluye las siguientes vistas principales:

Inicio: página principal del sitio.
Productos: catálogo de uniformes disponibles.
Detalle de producto: vista individual de cada producto.
Carrito: resumen de productos seleccionados.
Login: acceso de usuarios.
Administración: vistas destinadas a la gestión interna del ecommerce.

Importar Base de Datos:

En MySQL en la pestaña "Server" seleccionar "Data Import"
Dentro de "Data Import" seleccionar "import from Self-Contained File"
Elegir la ruta del archivo .sql
Clickear "Start Import"