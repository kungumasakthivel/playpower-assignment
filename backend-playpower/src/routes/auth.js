const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../models/database');
const dotenv = require('dotenv');
const authenticateToken = require('../middleware/authenticateToken');

dotenv.config();
const authRoutes = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'sakthivel';

authRoutes.get('/', (req, res) => {
    return res.send("auth routes working");
})

authRoutes.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '100h' });
    res.json({ token });
  });
});


authRoutes.post('/register', (req, res) => {
  const { email, password } = req.body;

  db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, password], function(err) {
    if (err) {
      return res.status(400).json({ message: 'User already exists' });
    }
    res.status(201).json({ id: this.lastID });
  });
});


authRoutes.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: `Hello, ${req.user.email}!`, email: req.email });
});


module.exports = authRoutes;