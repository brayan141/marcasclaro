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

exports.createText = (req, res) => {
  const { name, content } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'El nombre y el contenido son obligatorios' });
  }

  const sql = "INSERT INTO texts (name, content) VALUES (?, ?)";
  db.query(sql, [name, content], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear texto' });
    }
    res.status(201).json({ message: 'Texto creado', id: result.insertId });
  });
};

exports.updateText = (req, res) => {
  const { name } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'El contenido es obligatorio' });
  }

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
