const jwt = require('jsonwebtoken');

// Garantiza que siempre sea un string válido
const JWT_SECRET = String(process.env.JWT_SECRET || 'fallback_secret_key');

/**
 * Middleware para autenticar tokens JWT
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ error: 'Token no proporcionado en los encabezados.' });
    }

    // Se espera un encabezado tipo: "Authorization: Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Formato de token inválido (use "Bearer <token>").' });
    }

    // Verifica y decodifica el token
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.error('Error JWT:', err.message);
        return res.status(403).json({ error: 'Token inválido o expirado.' });
      }

      // Adjunta los datos del usuario decodificado a la solicitud
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Error interno en authenticateToken:', error);
    res.status(500).json({ error: 'Error interno en la autenticación.' });
  }
};

module.exports = { authenticateToken };
