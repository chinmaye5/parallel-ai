const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

// Debug: Log environment variables to verify
console.log('GROQ_API_KEY:', process.env.GROQ_API_KEY ? 'Loaded' : 'Missing');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://theparallelai.vercel.app'],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Error Handler
app.use(errorHandler);

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
