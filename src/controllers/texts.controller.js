const db = require("../config/conexion.js");

exports.getTexts = (req, res) => {
  const sql = "SELECT * FROM texts";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener textos' });
    }
    res.json({ texts: results });
  });
};

exports.updateText = (req, res) => {
  const { name } = req.params;
  const { content } = req.body;
  const sql = "UPDATE texts SET content = ? WHERE name = ?";
  db.query(sql, [content, name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar texto' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Texto no encontrado' });
    }
    res.json({ message: 'Texto actualizado' });
  });
};

exports.deleteText = (req, res) => {
  const { name } = req.params;
  const sql = "DELETE FROM texts WHERE name = ?";
  db.query(sql, [name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar texto' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Texto no encontrado' });
    }
    res.json({ message: 'Texto eliminado' });
  });
};
