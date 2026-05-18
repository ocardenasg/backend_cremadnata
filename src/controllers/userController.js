const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');
const { logAction } = require('../middleware/logger');
const { v4: uuidv4 } = require('uuid');

async function registerUser(req, res) {
  const { first_name, last_name, email, phone, role, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = uuidv4();

    const conn = await getConnection();
    const result = await conn.query(
      `INSERT INTO users (first_name, last_name, email, phone, role, password, activation_token)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone, role || 'client', hashedPassword, activationToken]
    );
    conn.release();

    await logAction('users', null, `Usuario registrado: ${email}`, { userId: result.insertId });

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const conn = await getConnection();
    const users = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    conn.release();

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is inactive' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    await logAction('users', user.id, `Usuario inició sesión: ${email}`);

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to login' });
  }
}

async function getAllUsers(req, res) {
  try {
    const conn = await getConnection();
    const users = await conn.query('SELECT id, first_name, last_name, email, phone, is_active, role, created_at, updated_at FROM users ORDER BY created_at DESC');
    conn.release();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function getUserById(req, res) {
  try {
    const conn = await getConnection();
    const users = await conn.query('SELECT id, first_name, last_name, email, phone, is_active, role, created_at, updated_at FROM users WHERE id = ?', [req.params.id]);
    conn.release();
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

async function updateUser(req, res) {
  const { first_name, last_name, email, phone, is_active, role } = req.body;
  try {
    const conn = await getConnection();
    const result = await conn.query(
      `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, is_active = ?, role = ? WHERE id = ?`,
      [first_name, last_name, email, phone, is_active, role, req.params.id]
    );
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await logAction('users', req.user?.id, `Usuario actualizado: ${req.params.id}`, { userId: req.params.id });

    res.json({ message: 'User updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

async function deleteUser(req, res) {
  try {
    const conn = await getConnection();
    const result = await conn.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await logAction('users', req.user?.id, `Usuario eliminado: ${req.params.id}`, { userId: req.params.id });

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

module.exports = { registerUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser };