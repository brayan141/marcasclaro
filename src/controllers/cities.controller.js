const db = require("../config/conexion.js");

exports.getCities = (req, res) => {
  const sql = "SELECT * FROM cities";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener ciudades' });
    }
    res.json({ cities: results });
  });
};

exports.updateCity = (req, res) => {
  const { filename } = req.params;
  const { nombre_ciudad, url_imagen } = req.body;
  const sql = "UPDATE cities SET nombre_ciudad = ?, url_imagen = ? WHERE url_imagen LIKE ?";
  db.query(sql, [nombre_ciudad, url_imagen, `%${filename}%`], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar ciudad' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }
    res.json({ message: 'Ciudad actualizada' });
  });
};

exports.getCityImages = (req, res) => {
  const { cityName } = req.params;
  const sql = "SELECT url_imagen FROM cities WHERE nombre_ciudad = ?";
  db.query(sql, [cityName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener imágenes de la ciudad' });
    }
    res.json({ images: results.map(row => row.url_imagen) });
  });
};

exports.deleteCity = (req, res) => {
  const { filename } = req.params;
  const sql = "DELETE FROM cities WHERE url_imagen LIKE ?";
  db.query(sql, [`%${filename}%`], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar ciudad' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ciudad no encontrada' });
    }
    res.json({ message: 'Ciudad eliminada' });
  });
};
