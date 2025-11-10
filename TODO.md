# Plan de Trabajo para Implementar Controllers y Rutas

## Información Recopilada
- **auth.controller.js**: Maneja autenticación (registro, login, update password, get users) con JWT. Usa bcrypt para hashing y mysql2 para DB.
- **routes.js**: Define rutas para auth bajo /api/, usando middleware authenticateToken.
- **middleware/jwt.js**: Middleware para verificar tokens JWT.
- **config/conexion.js**: Conexión a base de datos MySQL (pool).
- **database.sql**: Esquema de DB con tablas: users, banner, cities, texts, social_networks, company_icon.
- **index.js**: Servidor Express, rutas bajo /api/, CORS habilitado.
- No existen controllers para banners, cities, texts, social-networks, company-icon.
- No existen rutas de subida (uploadRoutes) ni rutas para las nuevas APIs.
- Se asume que para subida de archivos se usará multer (necesita instalación si no está en package.json).

## Plan Detallado
### 1. Instalar dependencias necesarias
- Verificar e instalar multer para manejo de subida de archivos (si no está presente). ✅ Completado: npm install multer.

### 2. Crear Controllers
- **CitiesController** (src/controllers/cities.controller.js): ✅ Creado
  - GET /api/ciudades: Obtener lista de ciudades (con auth).
  - PUT /api/ciudades/:filename: Actualizar ciudad por filename (con auth).
  - GET /api/ciudades/:cityName/images: Obtener imágenes de una ciudad (con auth).
  - DELETE /api/ciudades/:filename: Eliminar ciudad por filename (con auth).
- **BannersController** (src/controllers/banners.controller.js): ✅ Creado
  - GET /api/banners: Obtener lista de banners (con auth).
  - PUT /api/banners/:filename: Actualizar banner por filename (con auth).
  - DELETE /api/banners/:filename: Eliminar banner por filename (con auth).
- **TextsController** (src/controllers/texts.controller.js): ✅ Creado
  - GET /api/texts: Obtener lista de textos (con auth).
  - PUT /api/texts/:name: Actualizar texto por name (con auth).
  - DELETE /api/texts/:name: Eliminar texto por name (con auth).
- **SocialNetworksController** (src/controllers/social-networks.controller.js): ✅ Creado
  - GET /api/social-networks: Obtener lista de redes sociales (con auth).
  - PUT /api/social-networks/:id: Actualizar red social por id (con auth).
  - DELETE /api/social-networks/:id: Eliminar red social por id (con auth).
- **CompanyController** (src/controllers/company.controller.js): ✅ Creado
  - GET /api/company-icon: Obtener ícono de compañía (con auth).
  - PUT /api/company-icon/:filename: Actualizar ícono por filename (con auth).
  - DELETE /api/company-icon/:filename: Eliminar ícono por filename (con auth).

### 3. Crear Rutas de Subida (uploadRoutes)
- Crear src/routes/upload.routes.js: ✅ Creado
  - POST /upload/banner: Subir banner (con auth, usar multer).
  - POST /upload/city: Subir ciudad (con auth, usar multer).

### 4. Actualizar routes.js
- Importar y registrar nuevos controllers y uploadRoutes. ✅ Completado
- Agregar rutas para las APIs de banners, ciudades, texts, social-networks, company-icon. ✅ Completado

### 5. Lógica Común
- Todos los controllers usarán authenticateToken para proteger rutas. ✅ Implementado
- Operaciones CRUD básicas: SELECT, UPDATE, DELETE en DB. ✅ Implementado
- Para subida: Usar multer para guardar archivos en disco y registrar en DB. ✅ Implementado

## Archivos Dependientes a Crear/Editar
- src/controllers/cities.controller.js (nuevo) ✅
- src/controllers/banners.controller.js (nuevo) ✅
- src/controllers/texts.controller.js (nuevo) ✅
- src/controllers/social-networks.controller.js (nuevo) ✅
- src/controllers/company.controller.js (nuevo) ✅
- src/routes/upload.routes.js (nuevo) ✅
- src/routes/routes.js (editar para agregar rutas) ✅
- uploads/ (carpeta creada) ✅

## Pasos de Seguimiento
- Instalar multer si es necesario: npm install multer. ✅
- Crear carpeta uploads para archivos subidos. ✅
- Probar rutas con Postman o similar.
- Verificar conexión a DB y permisos de archivos.
- Asegurar que JWT_SECRET esté en .env.
