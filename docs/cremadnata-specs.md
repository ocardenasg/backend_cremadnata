# Creme della Nata - Backend API Specification

**Fecha de creación:** 2026-05-17
**Última actualización:** 2026-05-17
**Estado:** En planificación

---

## 1. Visión General

API RESTful para sistema de gestión de pastelería "Creme della Nata" con múltiples tecnologías de bases de datos.

### Stack Tecnológico

- **Runtime:** Node.js
- **Framework:** Express.js
- **DB Principal (datos):** MariaDB (Docker)
- **DB Documentos (órdenes):** MongoDB (Docker)
- **DB Logs:** MongoDB Atlas (cloud)

---

## 2. Arquitectura de Base de Datos

### 2.1 MariaDB (Docker) - Base de datos: `cremadnata`

#### Tabla: `products`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR(10) | Identificador único |
| name | VARCHAR(255) | Nombre del producto |
| description | TEXT | Descripción |
| price | DECIMAL(10,2) | Precio de venta |
| cost | DECIMAL(10,2) | Costo |
| category | VARCHAR(50) | Categoría |
| size | VARCHAR(50) | Tamaño |
| image | VARCHAR(500) | URL de imagen |
| stock | DECIMAL(10,2) | Stock disponible |
| provider | VARCHAR(50) | Proveedor |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

#### Tabla: `users`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT UNSIGNED | ID autoincremental |
| first_name | VARCHAR(50) | Nombre |
| last_name | VARCHAR(50) | Apellido |
| email | VARCHAR(100) | Email único |
| phone | VARCHAR(20) | Teléfono |
| is_active | TINYINT(1) | Activo (1/0) |
| role | VARCHAR(20) | Rol (admin, seller, client) |
| password | VARCHAR(255) | Password hasheada |
| activation_token | VARCHAR(64) | Token de activación |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |

### 2.2 MongoDB (Docker) - Base de datos: `orders_db`

#### Colección: `orders`

```json
{
  "id": "uuid",
  "products": [
    {
      "id": "string",
      "name": "string",
      "quantity": "number",
      "unit_price": "number",
      "total_price": "number"
    }
  ],
  "payment_type": {
    "type": "cash|transfer|mixed",
    "cash_amount": "number (optional)",
    "transfer_reference": "string (optional)"
  },
  "seller": {
    "id": "string",
    "name": "string"
  },
  "client": {
    "id": "string",
    "name": "string",
    "email": "string",
    "whatsapp": "string"
  },
  "total": "number",
  "created_at": "Date (UTC-6 Mexico)"
}
```

### 2.3 MongoDB Atlas - Base de datos: `logs_db`

#### Colección: `logs`

```json
{
  "id": "uuid",
  "service": "string (endpoint name)",
  "date": "Date (UTC-6 Mexico)",
  "user_id": "string",
  "description": "string (optional)",
  "tags": "object"
}
```

---

## 3. Endpoints API

### 3.1 Productos (MariaDB)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/products | Listar todos los productos |
| GET | /api/products/:id | Obtener producto por ID |
| POST | /api/products | Crear nuevo producto |
| PUT | /api/products/:id | Actualizar producto |
| DELETE | /api/products/:id | Eliminar producto |

### 3.2 Usuarios (MariaDB)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/users/register | Registrar nuevo usuario |
| POST | /api/users/login | Iniciar sesión (JWT) |
| GET | /api/users | Listar usuarios (admin) |
| GET | /api/users/:id | Obtener usuario por ID |
| PUT | /api/users/:id | Actualizar usuario |
| DELETE | /api/users/:id | Eliminar usuario |

### 3.3 Órdenes (MongoDB)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/orders | Listar todas las órdenes |
| GET | /api/orders/:id | Obtener orden por ID |
| POST | /api/orders | Crear nueva orden |
| PUT | /api/orders/:id | Actualizar orden |
| DELETE | /api/orders/:id | Eliminar orden |

---

## 4. Autenticación

- **Método:** JWT (JSON Web Tokens)
- **Hash de password:** bcrypt
- **Middleware de autenticación** para endpoints protegidos
- **Roles:** admin, seller, client

---

## 5. Docker Compose

Servicios configurados:

- **mariadb**: Puerto 3306
- **mongodb**: Puerto 27017
- **app**: Puerto 3000 (Express)

---

## 6. Variables de Entorno (`.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# MariaDB
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cremadnata
DB_USER=root
DB_PASSWORD=

# MongoDB (Docker)
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB=orders_db

# MongoDB Atlas (Logs)
MONGO_ATLAS_URI=mongodb+srv://<user>:<password>@<cluster>/logs_db

# JWT
JWT_SECRET=<your-secret-key>
JWT_EXPIRES_IN=7d
```

---

## 7. Plan de Desarrollo

### Fase 1: Configuración del Entorno
- [ ] Inicializar proyecto Node.js
- [ ] Instalar dependencias (express, mariadb, mongoose, bcrypt, jsonwebtoken, dotenv, cors)
- [ ] Crear estructura de directorios
- [ ] Configurar Docker Compose

### Fase 2: Base de Datos MariaDB
- [ ] Configurar conexión a MariaDB
- [ ] Crear tabla products
- [ ] Crear tabla users
- [ ] CRUD de productos

### Fase 3: Autenticación
- [ ] Implementar registro de usuarios
- [ ] Implementar login con JWT
- [ ] Middleware de autenticación
- [ ] CRUD de usuarios

### Fase 4: MongoDB (Órdenes)
- [ ] Configurar conexión a MongoDB Docker
- [ ] Crear modelo de Orders
- [ ] CRUD de órdenes

### Fase 5: MongoDB Atlas (Logs)
- [ ] Configurar conexión a Atlas
- [ ] Crear middleware de logging
- [ ] Guardar logs de operaciones importantes

### Fase 6: Testing y Documentación
- [ ] Probar todos los endpoints
- [ ] Crear README con instrucciones

---

## 8. Pendientes por Confirmar

- [ ] Connection string de MongoDB Atlas
- [ ] Puerto para MongoDB Docker (default: 27017)
- [ ] Puerto para MariaDB (default: 3306)