const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/conexion');
const { authenticateToken } = require('../middleware/jwt');

// 📁 Ruta física donde se guardan los archivos en cPanel
const UPLOADS_DIR = '/home/sotecemc/marcasclaro/uploads';

// 🧩 Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedFilename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, sanitizedFilename);
  }
});

const upload = multer({ storage });

// =======================================================
// 🔹 SUBIDA DE BANNER
// =======================================================
router.post('/banner', authenticateToken, upload.single('banner'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  const filename = req.file.filename;
  const url_imagen = `/uploads/${filename}`;
  const fullUrl = `https://marcascoctelesclaro.sotecem.com${url_imagen}`;

  const sql = "INSERT INTO banner (url_imagen) VALUES (?)";
  db.query(sql, [url_imagen], (err, result) => {
    if (err) {
      console.error('Error al guardar banner en DB:', err);
      return res.status(500).json({ error: 'Error al guardar banner en la base de datos' });
    }

    res.status(201).json({
      message: '✅ Banner subido exitosamente',
      id: result.insertId,
      url: fullUrl
    });
  });
});

// =======================================================
// 🔹 SUBIDA DE CIUDADES
// =======================================================
router.post('/city', authenticateToken, upload.single('city'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  const { nombre_ciudad } = req.body;
  if (!nombre_ciudad) {
    return res.status(400).json({ error: 'El nombre de la ciudad es obligatorio' });
  }

  const filename = req.file.filename;
  const url_imagen = `/uploads/${filename}`;
  const fullUrl = `https://marcascoctelesclaro.sotecem.com${url_imagen}`;

  const sql = "INSERT INTO cities (nombre_ciudad, url_imagen) VALUES (?, ?)";
  db.query(sql, [nombre_ciudad, url_imagen], (err, result) => {
    if (err) {
      console.error('Error al guardar ciudad en DB:', err);
      return res.status(500).json({ error: 'Error al guardar ciudad en la base de datos' });
    }

    res.status(201).json({
      message: '✅ Ciudad subida exitosamente',
      id: result.insertId,
      nombre_ciudad,
      url: fullUrl
    });
  });
});

module.exports = router;
