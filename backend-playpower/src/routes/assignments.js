const express = require('express');
const db = require('../models/database');
const authenticateToken = require('../middleware/authenticateToken');

const crudRoutes = express.Router();

crudRoutes.post('/create', authenticateToken, (req, res) => {
    const {title, body} = req.body;

    db.run(
        `INSERT INTO assignments (title, body, userId) VALUES (?, ?, ?)`,
        [title, body, req.user.id],
        function(err) {
            if(err) {
                return res.status(400).json({
                    message: 'Error while creating assignment'
                })
            }
            res.status(201).json({id: this.lastID, message: 'Created Successfully'});
        }
    )
})



module.exports = crudRoutes;