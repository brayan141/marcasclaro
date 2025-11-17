const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const routes = require('./src/routes/routes');
const pool = require('./src/config/conexion');

const PORT = process.env.PORT || 3000;

// Crear aplicación Express
const app = express();

// ===== Middlewares base =====
app.use((req, _res, next) => {
  // Normalizar slashes ANTES de CORS para que coincida la ruta real
  if (req.url.includes('//')) {
    req.url = req.url.replace(/\/{2,}/g, '/');
  }
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ===== CORS configuration (simplificada y robusta) =====
const allowedOrigins = [
  'https://marcasclaro.sotecem.com',
  'https://marcascoctelesclaro.sotecem.com', // Por si front se sirve desde backend host
  'http://localhost:4200',
  'http://localhost:3000'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  // Log de origen para debug (se puede retirar luego)
  if (origin) {
    console.log('[CORS] Origin:', origin, '=>', allowedOrigins.includes(origin) ? 'ALLOW' : 'DENY');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Preflight ok sin cuerpo
  }
  next();
});

// ===== Ruta física donde se guardan los archivos subidos =====
const uploadsPath = '/home/sotecemc/marcasclaro/uploads';

// ===== Servir archivos estáticos desde /api/uploads =====
// ⚠️ Importante: en cPanel, solo las rutas bajo /api llegan al Node app
app.use('/api/uploads', express.static(uploadsPath));

// ===== Rutas principales de la API =====
app.use('/api', routes);

// Health check para probar CORS rápido
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// ===== Manejo básico de errores =====
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ===== Arranque del servidor =====
app.listen(PORT, () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('❌ Error conectando a la base de datos:', err);
      return;
    }

    console.log('✅ Aplicación iniciada correctamente.');
    console.log(`🌐 API disponible en: https://marcascoctelesclaro.sotecem.com/api/`);
    console.log(`📁 Archivos estáticos en: https://marcascoctelesclaro.sotecem.com/api/uploads/`);
    console.log(`🔌 Conectado a la base de datos: mysql://root:@localhost/sotecemc_claro`);
    connection.release();
  });
});
