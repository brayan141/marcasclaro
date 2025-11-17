const db = require("../config/conexion.js");
const path = require("path");

const BASE_URL = "https://marcascoctelesclaro.sotecem.com";

/**
 * Obtener todos los banners
 */
exports.getBanners = (req, res) => {
  const sql = "SELECT * FROM banner ORDER BY id_banner DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener banners:", err);
      return res.status(500).json({ error: "Error al obtener banners" });
    }

    const banners = results.map(banner => ({
      ...banner,
      url_imagen: banner.url_imagen
        ? `${BASE_URL}${banner.url_imagen}`
        : null
    }));

    res.status(200).json({ banners });
  });
};

/**
 * Crear un nuevo banner
 */
exports.createBanner = (req, res) => {
  let url_imagen;

  if (req.file) {
    url_imagen = `/api/uploads/${req.file.filename}`;
  } else if (req.body.url_imagen) {
    url_imagen = req.body.url_imagen;
  } else {
    return res.status(400).json({
      error: "Debe proporcionar una imagen o una URL de imagen"
    });
  }

  const sql = "INSERT INTO banner (url_imagen) VALUES (?)";

  db.query(sql, [url_imagen], (err, result) => {
    if (err) {
      console.error("Error al crear banner:", err);
      return res.status(500).json({ error: "Error al crear banner" });
    }

    res.status(201).json({
      message: "✅ Banner creado exitosamente",
      id_banner: result.insertId,
      url_imagen: `${BASE_URL}${url_imagen}`
    });
  });
};

/**
 * Actualizar un banner existente
 */
exports.updateBanner = (req, res) => {
  const { id_banner } = req.params;
  let url_imagen;

  if (req.file) {
    url_imagen = `/api/uploads/${req.file.filename}`;
  } else if (req.body.url_imagen) {
    url_imagen = req.body.url_imagen;
  } else {
    return res.status(400).json({
      error: "Debe proporcionar una imagen o una URL de imagen"
    });
  }

  const sql = "UPDATE banner SET url_imagen = ? WHERE id_banner = ?";

  db.query(sql, [url_imagen, id_banner], (err, result) => {
    if (err) {
      console.error("Error al actualizar banner:", err);
      return res.status(500).json({ error: "Error al actualizar banner" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Banner no encontrado" });
    }

    res.status(200).json({
      message: "✅ Banner actualizado correctamente",
      id_banner,
      url_imagen: `${BASE_URL}${url_imagen}`
    });
  });
};

/**
 * Eliminar un banner por ID
 */
exports.deleteBanner = (req, res) => {
  const { id_banner } = req.params;

  const sql = "DELETE FROM banner WHERE id_banner = ?";

  db.query(sql, [id_banner], (err, result) => {
    if (err) {
      console.error("Error al eliminar banner:", err);
      return res.status(500).json({ error: "Error al eliminar banner" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Banner no encontrado" });
    }

    res.status(200).json({ message: "🗑️ Banner eliminado exitosamente" });
  });
};
