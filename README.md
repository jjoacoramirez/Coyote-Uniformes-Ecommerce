# Coyote Uniformes — Backend API

API REST para la tienda online de Coyote Uniformes. Desarrollada con Spring Boot 4, Spring Security y JWT.

## Requisitos

- Java 17+
- Maven 3.8+
- MySQL 8+

## Configuración

### 1. Base de datos

Crear un usuario MySQL o usar `root`. La base de datos se crea automáticamente al levantar la app si no existe.

### 2. application.properties

El archivo se encuentra en `src/main/resources/application.properties`. Ajustar las credenciales de MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tienda_online?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD
```

### 3. Usuario inicial

Insertar un usuario administrador manualmente en la base de datos (la app no tiene endpoint de registro de admins):

```sql
INSERT INTO usuarios (nombre, apellido, email, contrasena, rol, fecha_registro, estado)
VALUES (
  'Admin',
  'Coyote',
  'admin@coyoteuniformes.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: password
  'ROLE_ADMIN',
  CURDATE(),
  'ACTIVO'
);
```

> Para usar otra contraseña, generá el hash BCrypt con cualquier herramienta online o desde la app.

## Levantar el proyecto

```bash
# Clonar el repo
git clone <url-del-repo>
cd Coyote-Uniformes-Ecommerce

# Compilar y correr
./mvnw spring-boot:run
```

En Windows:
```bash
mvnw.cmd spring-boot:run
```

La API queda disponible en `http://localhost:8080/api`.

## Autenticación

La API usa JWT. Para acceder a endpoints protegidos:

**1. Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@coyoteuniformes.com",
  "password": "password"
}
```

**2. Usar el token devuelto en cada request:**
```
Authorization: Bearer <token>
```

## Roles

| Rol | Descripción |
|---|---|
| `ROLE_ADMIN` | Acceso completo |
| `ROLE_USER` | Acceso a carrito, pedidos propios y catálogo |

## Endpoints principales

Todos los endpoints tienen el prefijo `/api`.

| Método | Endpoint | Acceso |
|---|---|---|
| POST | `/auth/login` | Público |
| GET | `/categorias`, `/productos`, `/variantes` | Público |
| POST/PUT/DELETE | `/categorias/**`, `/productos/**`, `/variantes/**` | ADMIN |
| GET/POST/PUT/DELETE | `/usuarios/**`, `/clientes/**`, `/administradores/**` | ADMIN |
| GET/POST | `/pedidos/**` | USER + ADMIN |
| PUT/DELETE | `/pedidos/**` | ADMIN |
| GET/POST | `/carritos/**`, `/items-carrito/**` | USER + ADMIN |

## Stack

- Spring Boot 4.0.4
- Spring Security 6 + JWT (jjwt 0.12.6)
- Spring Data JPA + Hibernate
- MySQL 8
- Lombok
