const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
require('dotenv').config();
const connectDb = require('./config/db');
const router = require('./routes');
const callbackHandler = require('./controller/payments/callbackHandler');


const app = express();

// Middleware to enable CORS
{/**
    app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
    }));
**/}

// Allow requests from your frontend domain
const corsOptions = {
    origin: 'https://leemart-complete-b23v.vercel.app', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies or other credentials
  };
  
  app.use(cors(corsOptions));

app.options('*', cors(corsOptions));




app.use(cookieParser())

// Middleware to parse JSON request bodies
app.use(express.json());

// Router
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