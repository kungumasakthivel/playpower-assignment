const jwt = require('jsonwebtoken');
const db = require('../models/database');
const dotenv = require('dotenv');

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || 'sakthivel';

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.sendStatus(401); // Unauthorized if no token is provided
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }

    // Query the user from the database
    db.get(`SELECT * FROM users WHERE id = ?`, [decoded.id], (err, user) => {
      if (err || !user) {
        return res.sendStatus(403); // Forbidden if user not found
      }

      req.user = user; // Attach user to the request object
      next(); // Proceed to the next middleware or route handler
    });
  });
};

module.exports = authenticateToken;