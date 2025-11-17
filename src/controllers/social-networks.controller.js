const db = require("../config/conexion.js");

const BASE_URL = "https://marcascoctelesclaro.sotecem.com";

exports.getSocialNetworks = (req, res) => {
  const sql = "SELECT * FROM social_networks";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener redes sociales' });
    }
    const socialNetworks = results.map((sn) => ({
      ...sn,
      icon_filename: sn.icon_filename ? `${BASE_URL}${sn.icon_filename}` : null,
    }));
    res.status(200).json({ socialNetworks });
  });
};

exports.createSocialNetwork = (req, res) => {
  const { name, url } = req.body;
  let icon_filename;

  if (req.file) {
    // Si se subió un archivo, usar la ruta del archivo
    icon_filename = `/api/uploads/${req.file.filename}`;
  } else if (req.body.icon_filename) {
    // Si se envió una URL directamente
    icon_filename = req.body.icon_filename;
  } else {
    return res.status(400).json({ error: 'Debe proporcionar una imagen o una URL de imagen' });
  }

  const sql = "INSERT INTO social_networks (name, url, icon_filename) VALUES (?, ?, ?)";
  db.query(sql, [name, url, icon_filename], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear red social' });
    }
    res.status(201).json({
      message: '✅ Red social creada',
      id: result.insertId,
      icon_filename: icon_filename ? `${BASE_URL}${icon_filename}` : null,
    });
  });
};

exports.updateSocialNetwork = (req, res) => {
  const { id } = req.params;
  const { name, url } = req.body;
  let icon_filename;

  if (req.file) {
    // Si se subió un archivo, usar la ruta del archivo
    icon_filename = `/api/uploads/${req.file.filename}`;
  } else if (req.body.icon_filename) {
    // Si se envió una URL directamente
    icon_filename = req.body.icon_filename;
  } else {
    return res.status(400).json({ error: 'Debe proporcionar una imagen o una URL de imagen' });
  }

  const sql = "UPDATE social_networks SET name = ?, url = ?, icon_filename = ? WHERE id_social = ?";
  db.query(sql, [name, url, icon_filename, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar red social' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Red social no encontrada' });
    }
    res.status(200).json({
      message: '✅ Red social actualizada',
      id,
      icon_filename: icon_filename ? `${BASE_URL}${icon_filename}` : null,
    });
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
    res.status(200).json({ message: '🗑️ Red social eliminada' });
  });
};
