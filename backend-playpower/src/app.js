const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies


// Import routes
const authRoutes = require('./routes/auth');
const crudRoutes = require('./routes/assignments');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/assignments', crudRoutes);

app.get('/', (req,res) => {
    return res.send("API working");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));