const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/conexion');
const { authenticateToken } = require('../middleware/jwt');

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// POST /upload/banner
router.post('/banner', authenticateToken, upload.single('banner'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }
  const url_imagen = req.file.path;
  const sql = "INSERT INTO banner (url_imagen) VALUES (?)";
  db.query(sql, [url_imagen], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al guardar banner en DB' });
    }
    res.status(201).json({ message: 'Banner subido exitosamente', filename: req.file.filename });
  });
});

// POST /upload/city
router.post('/city', authenticateToken, upload.single('city'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }
  const { nombre_ciudad } = req.body;
  if (!nombre_ciudad) {
    return res.status(400).json({ error: 'Nombre de ciudad requerido' });
  }
  const url_imagen = req.file.path;
  const sql = "INSERT INTO cities (nombre_ciudad, url_imagen) VALUES (?, ?)";
  db.query(sql, [nombre_ciudad, url_imagen], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al guardar ciudad en DB' });
    }
    res.status(201).json({ message: 'Ciudad subida exitosamente', filename: req.file.filename });
  });
});

module.exports = router;
