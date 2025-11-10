const db = require("../config/conexion.js");

exports.getBanners = (req, res) => {
  const sql = "SELECT * FROM banner";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener banners' });
    }
    res.json({ banners: results });
  });
};

exports.updateBanner = (req, res) => {
  const { filename } = req.params;
  const { url_imagen } = req.body;
  const sql = "UPDATE banner SET url_imagen = ? WHERE url_imagen LIKE ?";
  db.query(sql, [url_imagen, `%${filename}%`], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar banner' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Banner no encontrado' });
    }
    res.json({ message: 'Banner actualizado' });
  });
};

exports.deleteBanner = (req, res) => {
  const { filename } = req.params;
  const sql = "DELETE FROM banner WHERE url_imagen LIKE ?";
  db.query(sql, [`%${filename}%`], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar banner' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Banner no encontrado' });
    }
    res.json({ message: 'Banner eliminado' });
  });
};
