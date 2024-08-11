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

// all assignment task 
crudRoutes.get('/getall', authenticateToken, (req, res) => {
  db.all(`SELECT * FROM assignments WHERE userId = ?`, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(400).json({ message: 'Error retrieving assignments' });
    }
    res.json(rows);
  });
});

crudRoutes.put('/update/:id', authenticateToken, (req, res) => {
    const assignmentId = req.params.id;
    const {title, body} = req.body;

    db.run(
        `UPDATE assignments SET title = ?, body = ?
        WHERE id = ? AND userId = ?`,
        [title, body, assignmentId, req.user.id],
        function(err) {
            if(err) {
                return res.send(400).json({
                    message: "Error in updating!"
                })
            }
            if(this.changes === 0) {
                return res.status(404).json({
                    message: 'Assignment not found!'
                })
            }
            res.json({
                message: 'Assignment updated successfully!'
            })
        }
    )
})


crudRoutes.delete('/delete/:id', authenticateToken, (req, res) => {
  const assignmentId = req.params.id;

  db.run(`DELETE FROM assignments WHERE id = ? AND userId = ?`, 
    [assignmentId, req.user.id], 
    function(err) {
        if (err) {
            return res.status(400).json({ message: 'Error deleting assignment' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        res.json({ message: 'Assignment deleted successfully' });
    });
});


module.exports = crudRoutes;