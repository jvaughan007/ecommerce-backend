const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Utility function to validate email format
const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).send("Username, email, and password are required.");
  }
  if (!validateEmail(email)) {
    return res.status(400).send("Invalid email format.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, email, hashedPassword, role || 'user']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).send("Error registering the user: " + error.message);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length > 0) {
      const user = rows[0];
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (isValid) {
        const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ message: 'Login successful', token });
      } else {
        res.status(401).send('Invalid credentials');
      }
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send("Error logging in the user: " + error.message);
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send("Error retrieving the user: " + error.message);
  }
};

exports.getUserOrders = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).send('No orders found for this user');
    }
  } catch (error) {
    res.status(500).send("Error retrieving user orders: " + error.message);
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  const requesterId = req.user.userId;
  const requesterRole = req.user.role;

  // Allow if requester is admin or updating their own profile
  if (requesterRole !== 'admin' && requesterId != id) {
    return res.status(403).send('You are not authorized to update this profile.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'UPDATE users SET username = $1, email = $2, password_hash = $3, role = $4 WHERE id = $5 RETURNING *',
      [username, email, hashedPassword, role, id]
    );
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send("Error updating the user: " + error.message);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;  // ID of the user to be deleted
  const requesterId = req.user.userId;  // ID from the JWT of the requester
  const requesterRole = req.user.role;  // Role from the JWT of the requester

  // Allow deletion if requester is admin or they are deleting their own account
  if (requesterRole !== 'admin' && requesterId != id) {
    return res.status(403).send('You are not authorized to delete this profile.');
  }

  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.status(200).send('User deleted');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send("Error deleting the user: " + error.message);
  }
};



