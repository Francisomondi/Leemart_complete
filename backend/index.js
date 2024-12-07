const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDb = require('./config/db');
const router = require('./routes');
const callbackHandler = require('./controller/payments/callbackHandler');

const app = express();

// Allowed origins
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// Middlewares
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api', router);
app.post('/callback', callbackHandler);

// Define the port
const PORT = process.env.PORT || 8000;

// Connect to the database and start the server
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log('Connected to DB');
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Failed to connect to the database', error);
});
