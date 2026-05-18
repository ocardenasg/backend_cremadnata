# Creme della Nata - Backend API

API RESTful para la gestión de la pastelería "Creme della Nata".

## Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Configuración](#configuración)
- [Variables de Entorno](#variables-de-entorno)
- [Docker Compose](#docker-compose)
- [Ejecutar el Proyecto](#ejecutar-el-proyecto)
- [Endpoints API](#endpoints-api)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Autenticación](#autenticación)
- [Logging](#logging)

---

## Descripción

Backend API construido con Express.js que gestiona:
- **Productos** (MariaDB) - Catálogo de productos de pastelería
- **Usuarios** (MariaDB) - Gestión de usuarios con autenticación JWT
- **Órdenes** (MongoDB Docker) - Documentos de órdenes de compra
- **Logs** (MongoDB Atlas) - Registro de operaciones importantes

---

## Tecnologías

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Base de datos principal:** MariaDB 10.11 (Docker)
- **Base de datos documentos:** MongoDB 7 (Docker)
- **Base de datos logs:** MongoDB Atlas (cloud)
- **Autenticación:** JWT + bcrypt
- **Contenedores:** Docker + Docker Compose

---

## Estructura del Proyecto

```
backend/
├── data/                    # Datos persistentes de Docker
│   ├── mariadb/            # Datos de MariaDB
│   └── mongodb/            # Datos de MongoDB
├── docs/                   # Documentación y especificaciones
├── src/
│   ├── config/             # Configuraciones de bases de datos
│   │   ├── database.js     # Conexión MariaDB
│   │   ├── mongoDb.js      # Conexión MongoDB Docker
│   │   └── mongoAtlas.js   # Conexión MongoDB Atlas
│   ├── controllers/        # Controladores de la API
│   │   ├── productController.js
│   │   ├── userController.js
│   │   └── orderController.js
│   ├── middleware/         # Middlewares
│   │   ├── auth.js         # Autenticación JWT
│   │   └── logger.js       # Helper de logging
│   ├── models/             # Modelos MongoDB
│   │   ├── Order.js        # Modelo de órdenes
│   │   └── Log.js          # Modelo de logs
│   ├── routes/             # Rutas de la API
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   └── orderRoutes.js
│   ├── services/           # Servicios
│   │   └── logService.js   # Servicio de logging
│   └── index.js            # Punto de entrada
├── .env                    # Variables de entorno (no compartir)
├── .env.example            # Ejemplo de variables de entorno
├── docker-compose.yml      # Configuración de contenedores
├── package.json            # Dependencias npm
└── README.md               # Este archivo
```

---

## Requisitos Previos

- Node.js v18 o superior
- Docker y Docker Compose
- MongoDB Atlas (opcional, para logs en la nube)

---

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura los valores:

```bash
cp .env.example .env
```

Edita `.env` con tus configuraciones.

### 3. Configurar MongoDB Atlas (opcional)

Para habilitar los logs en MongoDB Atlas:
1. Crea un cluster en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Obtén el connection string
3. Actualiza `MONGO_ATLAS_URI` en el archivo `.env`

---

## Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `DB_HOST` | Host de MariaDB | `localhost` |
| `DB_PORT` | Puerto de MariaDB | `3306` |
| `DB_NAME` | Nombre de la base de datos | `cremadnata` |
| `DB_USER` | Usuario de MariaDB | `root` |
| `DB_PASSWORD` | Contraseña de MariaDB | `rootpassword` |
| `MONGO_HOST` | Host de MongoDB Docker | `localhost` |
| `MONGO_PORT` | Puerto de MongoDB Docker | `27018` |
| `MONGO_DB` | Base de datos de órdenes | `orders_db` |
| `MONGO_ATLAS_URI` | Connection string de Atlas | (configurar) |
| `JWT_SECRET` | Clave secreta para JWT | (cambiar) |
| `JWT_EXPIRES_IN` | Expiración del token | `7d` |

---

## Docker Compose

### Servicios configurados

| Servicio | Imagen | Puerto | Propósito |
|----------|--------|--------|------------|
| `mariadb` | mariadb:10.11 | 3306 | Base de datos relacional (productos, usuarios) |
| `mongodb` | mongo:7 | 27018 | Base de datos de documentos (órdenes) |

### Iniciar contenedores

```bash
docker-compose up -d
```

### Ver estado de contenedores

```bash
docker ps
```

### Detener contenedores

```bash
docker-compose down
```

---

## Ejecutar el Proyecto

### Modo desarrollo (con nodemon)

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

### Verificar que la API está corriendo

```bash
curl http://localhost:3000/health
```

Respuesta esperada:
```json
{"status":"ok","timestamp":"2026-05-18T00:00:00.000Z"}
```

---

## Endpoints API

### Productos (`/api/products`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/products` | Listar todos los productos | No |
| GET | `/products/:id` | Obtener producto por ID | No |
| POST | `/products` | Crear nuevo producto | Sí (admin, seller) |
| PUT | `/products/:id` | Actualizar producto | Sí (admin, seller) |
| DELETE | `/products/:id` | Eliminar producto | Sí (admin) |

### Usuarios (`/api/users`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/users/register` | Registrar nuevo usuario | No |
| POST | `/users/login` | Iniciar sesión | No |
| GET | `/users` | Listar todos los usuarios | Sí (admin) |
| GET | `/users/:id` | Obtener usuario por ID | Sí |
| PUT | `/users/:id` | Actualizar usuario | Sí (admin) |
| DELETE | `/users/:id` | Eliminar usuario | Sí (admin) |

### Órdenes (`/api/orders`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/orders` | Listar todas las órdenes | Sí (admin, seller) |
| GET | `/orders/:id` | Obtener orden por ID | Sí |
| POST | `/orders` | Crear nueva orden | Sí (admin, seller) |
| PUT | `/orders/:id` | Actualizar orden | Sí (admin, seller) |
| DELETE | `/orders/:id` | Eliminar orden | Sí (admin) |

---

## Ejemplos de Uso

### Registrar un usuario

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@email.com",
    "phone": "1234567890",
    "password": "password123",
    "role": "client"
  }'
```

### Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@email.com",
    "password": "password123"
  }'
```

Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@email.com",
    "role": "client"
  }
}
```

### Crear un producto (requiere auth)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "id": "PROD001",
    "name": "Pastel de Chocolate",
    "description": "Delicioso pastel de chocolate",
    "price": 250.00,
    "cost": 150.00,
    "category": "pasteles",
    "size": "mediano",
    "stock": 10,
    "provider": "Proveedor A"
  }'
```

### Crear una orden (requiere auth)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "products": [
      {
        "id": "PROD001",
        "name": "Pastel de Chocolate",
        "quantity": 2,
        "unit_price": 250.00,
        "total_price": 500.00
      }
    ],
    "payment_type": {
      "type": "cash",
      "cash_amount": 500.00
    },
    "seller": {
      "id": "1",
      "name": "Maria García"
    },
    "client": {
      "id": "1",
      "name": "Juan Pérez",
      "email": "juan@email.com",
      "whatsapp": "1234567890"
    },
    "total": 500.00
  }'
```

---

## Autenticación

La API usa JWT (JSON Web Tokens) para autenticación.

### Headers requeridos

```http
Authorization: Bearer <token_jwt>
```

### Roles disponibles

- `admin`: Acceso completo
- `seller`: Puede gestionar productos y órdenes
- `client`: Acceso limitado

### Middleware de autenticación

El middleware `authenticateToken` verifica el token JWT en cada request protegido.

El middleware `requireRole` verifica que el usuario tenga el rol necesario.

---

## Logging

Los logs de operaciones importantes se guardan en MongoDB Atlas (si está configurado) o se muestran en consola.

### Logger helper

El archivo `src/middleware/logger.js` proporciona funciones para logging:

```javascript
const { logAction } = require('./middleware/logger');

// Usage
await logAction('products', userId, 'Producto creado', { productId: id });
```

### Eventos registrados

- Creación/actualización/eliminación de productos
- Registro de usuarios
- Inicio de sesión
- Creación/actualización/eliminación de órdenes

---

## Licencia

ISC