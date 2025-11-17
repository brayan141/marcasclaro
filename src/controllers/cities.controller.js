const db = require("../config/conexion.js");

const BASE_URL = "https://marcascoctelesclaro.sotecem.com";

/**
 * Obtener todas las ciudades
 */
exports.getCities = (req, res) => {
  const sql = "SELECT * FROM cities ORDER BY id_city DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener ciudades:", err);
      return res.status(500).json({ error: 'Error al obtener ciudades' });
    }
    const cities = results.map(city => ({
      ...city,
      url_imagen: city.url_imagen ? `${BASE_URL}${city.url_imagen}` : null
    }));
    res.status(200).json({ cities });
  });
};

exports.createCity = (req, res) => {
  const { nombre_ciudad } = req.body;
  // Validación requerida por el esquema (NOT NULL)
  if (!nombre_ciudad || !String(nombre_ciudad).trim()) {
    return res.status(400).json({ error: 'El nombre de la ciudad es obligatorio' });
  }
  let url_imagen;

  if (req.file) {
    // Si se subió un archivo, usar la ruta del archivo
    url_imagen = `/api/uploads/${req.file.filename}`;
  } else if (req.body.url_imagen) {
    // Si se envió una URL directamente
    url_imagen = req.body.url_imagen;
  } else {
    return res.status(400).json({ error: 'Debe proporcionar una imagen o una URL de imagen' });
  }

  const sql = "INSERT INTO cities (nombre_ciudad, url_imagen) VALUES (?, ?)";
  db.query(sql, [nombre_ciudad, url_imagen], (err, result) => {
    if (err) {
      console.error("Error al crear ciudad:", err);
      return res.status(500).json({ error: 'Error al crear ciudad' });
    }
    res.status(201).json({
      message: '✅ Ciudad creada exitosamente',
      id_city: result.insertId,
      url_imagen: `${BASE_URL}${url_imagen}`
    });
  });
};

exports.updateCity = (req, res) => {
  const { id_city } = req.params;
  const { nombre_ciudad } = req.body;
  // Validación requerida por el esquema (NOT NULL)
  if (!nombre_ciudad || !String(nombre_ciudad).trim()) {
    return res.status(400).json({ error: 'El nombre de la ciudad es obligatorio' });
  }
  let url_imagen;

  if (req.file) {
    url_imagen = `/api/uploads/${req.file.filename}`;
  } else if (req.body.url_imagen) {
    url_imagen = req.body.url_imagen;
  } else {
    return res.status(400).json({ error: 'Debe proporcionar una imagen o una URL de imagen' });
  }

  const sql = "UPDATE cities SET nombre_ciudad = ?, url_imagen = ? WHERE id_city = ?";
  db.query(sql, [nombre_ciudad, url_imagen, id_city], (err, result) => {
    if (err) {
      console.error("Error al actualizar ciudad:", err);
      return res.status(500).json({ error: 'Error al actualizar ciudad' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }
    res.status(200).json({
      message: '✅ Ciudad actualizada correctamente',
      id_city,
      url_imagen: `${BASE_URL}${url_imagen}`
    });
  });
};

exports.getCityImages = (req, res) => {
  const { cityName } = req.params;
  const sql = "SELECT url_imagen FROM cities WHERE nombre_ciudad = ? ORDER BY id_city DESC";
  db.query(sql, [cityName], (err, results) => {
    if (err) {
      console.error("Error al obtener imágenes de la ciudad:", err);
      return res.status(500).json({ error: 'Error al obtener imágenes de la ciudad' });
    }
    const images = results.map(row => row.url_imagen ? `${BASE_URL}${row.url_imagen}` : null);
    res.status(200).json({ images });
  });
};

exports.deleteCity = (req, res) => {
  const { id_city } = req.params;
  const sql = "DELETE FROM cities WHERE id_city = ?";
  db.query(sql, [id_city], (err, result) => {
    if (err) {
      console.error("Error al eliminar ciudad:", err);
      return res.status(500).json({ error: 'Error al eliminar ciudad' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }
    res.status(200).json({ message: '🗑️ Ciudad eliminada exitosamente' });
  });
};
