import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './DB/db.js';
import Userrouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';
import aiRouter from './routes/ai.routes.js';
import cors from 'cors';
import path from 'path';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true, // Allow cookies if needed
  })
);

app.use(express.json());

 
app.use('/api/user', Userrouter);
app.use('/api/post', postRouter);
app.use('/api/ai', aiRouter);

// Serve static files
const __dirname = path.resolve(); // Use path.resolve() to get the directory
app.use(express.static(path.join(__dirname, '/Frontend/dist')));
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'dist', 'index.html'));
});

// Start server
app.listen(7000, () => {
  console.log('Server is running on port 7000');
});
