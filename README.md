# Coyote Uniformes Ecommerce

Proyecto web para la gestion y venta online de uniformes de Coyote Uniformes. Incluye un backend con API REST desarrollada en Spring Boot y un frontend desarrollado con React + Vite.

La aplicacion permite consultar catalogo de productos, categorias y variantes, gestionar usuarios, clientes, administradores, pedidos y carritos, y acceder a funciones protegidas mediante autenticacion JWT.

## Tecnologias utilizadas

- Java 17
- Spring Boot 4
- Spring Security + JWT
- Spring Data JPA / Hibernate
- MySQL 8
- Maven
- React
- Vite
- React Router

## Requisitos previos

Antes de ejecutar el proyecto, instalar:

- Java 17 o superior
- Maven 3.8 o superior, o usar el wrapper incluido (`mvnw` / `mvnw.cmd`)
- MySQL 8 o superior
- Node.js y npm

## Configuracion de la base de datos

El backend utiliza MySQL. La configuracion principal esta en:

```text
src/main/resources/application.properties
```

Por defecto se conecta a:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tienda_online?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
```

Si tu usuario de MySQL tiene contrasena, agregar o modificar:

```properties
spring.datasource.password=TU_PASSWORD
```

La base de datos `tienda_online` se crea automaticamente al iniciar la aplicacion si no existe.

## Ejecutar el backend

Desde la raiz del proyecto:

```bash
mvnw.cmd spring-boot:run
```

En Linux o macOS:

```bash
./mvnw spring-boot:run
```

El backend queda disponible en:

```text
http://localhost:8080/api
```

## Ejecutar el frontend

En otra terminal, entrar a la carpeta del frontend:

```bash
cd frontend
npm install
npm run dev
```

El frontend queda disponible normalmente en:

```text
http://localhost:5173
```

## Usuario administrador inicial

Si se necesita acceder como administrador, se puede insertar un usuario manualmente en MySQL:

```sql
INSERT INTO usuarios (nombre, apellido, email, contrasena, rol, fecha_registro, estado)
VALUES (
  'Admin',
  'Coyote',
  'admin@coyoteuniformes.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'ROLE_ADMIN',
  CURDATE(),
  'ACTIVO'
);
```

La contrasena de este usuario es:

```text
password
```

## Scripts utiles

Backend:

```bash
mvnw.cmd spring-boot:run
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
```

## Autenticacion

La API usa JWT. Para iniciar sesion:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@coyoteuniformes.com",
  "password": "password"
}
```

Luego se debe enviar el token en las peticiones protegidas:

```text
Authorization: Bearer <token>
```

## Estructura general

```text
Coyote-Uniformes-Ecommerce/
+-- src/                 # Backend Spring Boot
+-- frontend/            # Frontend React + Vite
+-- pom.xml              # Dependencias y configuracion Maven
+-- mvnw / mvnw.cmd      # Maven Wrapper
+-- README.md
```
