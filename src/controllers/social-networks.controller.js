const db = require("../config/conexion.js");

exports.getSocialNetworks = (req, res) => {
  const sql = "SELECT * FROM social_networks";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener redes sociales' });
    }
    res.json({ socialNetworks: results });
  });
};

exports.updateSocialNetwork = (req, res) => {
  const { id } = req.params;
  const { name, url, icon_filename } = req.body;
  const sql = "UPDATE social_networks SET name = ?, url = ?, icon_filename = ? WHERE id_social = ?";
  db.query(sql, [name, url, icon_filename, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar red social' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Red social no encontrada' });
    }
    res.json({ message: 'Red social actualizada' });
  });
};

exports.deleteSocialNetwork = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM social_networks WHERE id_social = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar red social' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Red social no encontrada' });
    }
    res.json({ message: 'Red social eliminada' });
  });
};
