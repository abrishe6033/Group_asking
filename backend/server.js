const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');

const app = express();

// Middleware


app.use(cors({
    // origin: 'http://localhost:5000',
    // credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
testConnection();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);

// Home route
// 
app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: 'Welcome to Evangadi Networks API' 
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!'
    });
});



// app.use('*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Route not found'
//     });
// });

const PORT = process.env.PORT ;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});


