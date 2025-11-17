const db = require("../config/conexion.js");
const BASE_URL = "https://marcascoctelesclaro.sotecem.com";

exports.getCompanyIcon = (req, res) => {
  const sql = "SELECT * FROM company_icon";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener ícono de compañía' });
    }
    const companyIcons = results.map(icon => ({
      ...icon,
      filename: icon.filename ? `${BASE_URL}${icon.filename}` : null
    }));
    res.status(200).json({ companyIcons });
  });
};

exports.createCompanyIcon = (req, res) => {
  let filename;

  if (req.file) {
    // Si se subió un archivo, usar el nombre del archivo
    filename = `/api/uploads/${req.file.filename}`;
  } else if (req.body.filename) {
    // Si se envió un filename directamente
    filename = req.body.filename;
  } else {
    return res.status(400).json({ error: 'Debe proporcionar un archivo o un filename' });
  }

  const sql = "INSERT INTO company_icon (filename) VALUES (?)";
  db.query(sql, [filename], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear ícono de compañía' });
    }
    const fullFilename = filename ? `${BASE_URL}${filename}` : null;
    res.status(201).json({ message: '✅ Ícono de compañía creado', id: result.insertId, filename: fullFilename });
  });
};

exports.updateCompanyIcon = (req, res) => {
  const { filename } = req.params;
  let newFilename;

  if (req.file) {
    // Si se subió un archivo, usar el nombre del archivo
    newFilename = `/api/uploads/${req.file.filename}`;
  } else if (req.body.filename) {
    // Si se envió un filename directamente
    newFilename = req.body.filename;
  } else {
    return res.status(400).json({ error: 'Debe proporcionar un archivo o un filename' });
  }

  const sql = "UPDATE company_icon SET filename = ? WHERE filename LIKE ?";
  db.query(sql, [newFilename, `%${filename}%`], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar ícono de compañía' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ícono no encontrado' });
    }
    const fullFilename = newFilename ? `${BASE_URL}${newFilename}` : null;
    res.status(200).json({ message: '✅ Ícono de compañía actualizado', filename: fullFilename });
  });
};

exports.deleteCompanyIcon = (req, res) => {
  const { filename } = req.params;
  const sql = "DELETE FROM company_icon WHERE filename LIKE ?";
  db.query(sql, [`%${filename}%`], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar ícono de compañía' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ícono no encontrado' });
    }
    res.status(200).json({ message: '🗑️ Ícono de compañía eliminado' });
  });
};
