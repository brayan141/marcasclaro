const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/conexion');

const JWT_SECRET = String(process.env.JWT_SECRET || 'fallback_secret_key');

// ✅ Registrar usuario nuevo
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const [existingUser] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    await db.promise().query(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// ✅ Iniciar sesión (login)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    // Buscar usuario
    const [users] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];

    // Validar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id_user: user.id_user, username: user.username },
      JWT_SECRET,
      { expiresIn: '4h' }
    );

    res.json({ message: 'Login exitoso', token });
} catch (err) {
  console.error('🛑 Error en login:');
  console.error('Mensaje:', err.message);
  console.error('Stack:', err.stack);
  console.error('JWT_SECRET (tipo):', typeof JWT_SECRET);
  console.error('JWT_SECRET (valor inicial 10 chars):', JWT_SECRET ? JWT_SECRET.substring(0, 10) + '...' : 'undefined');
  console.error('Usuario que intentó loguearse:', username);

  return res.status(500).json({
    error: 'Error interno al iniciar sesión',
    detalles: 'Consulta el log del servidor para más información'
  });
}

};

// ✅ Actualizar contraseña
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id_user;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Debe ingresar la contraseña actual y la nueva' });
    }

    // Buscar usuario
    const [users] = await db.promise().query('SELECT * FROM users WHERE id_user = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];

    // Verificar contraseña actual
    const validPassword = await bcrypt.compare(oldPassword, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar en DB
    await db.promise().query('UPDATE users SET password_hash = ? WHERE id_user = ?', [hashedPassword, userId]);

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error en updatePassword:', err);
    res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
};

// ✅ Obtener lista de usuarios (solo autenticados)
exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.promise().query('SELECT id_user, username, fecha_creacion, fecha_modificacion FROM users');
    res.json(users);
  } catch (err) {
    console.error('Error en getUsers:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};
