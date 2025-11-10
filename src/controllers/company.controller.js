const db = require("../config/conexion.js");

exports.getCompanyIcon = (req, res) => {
  const sql = "SELECT * FROM company_icon";
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener ícono de compañía' });
    }
    res.json({ companyIcons: results });
  });
};

exports.updateCompanyIcon = (req, res) => {
  const { filename } = req.params;
  const { filename: newFilename } = req.body;
  const sql = "UPDATE company_icon SET filename = ? WHERE filename LIKE ?";
  db.query(sql, [newFilename, `%${filename}%`], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar ícono de compañía' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ícono no encontrado' });
    }
    res.json({ message: 'Ícono de compañía actualizado' });
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
    res.json({ message: 'Ícono de compañía eliminado' });
  });
};
