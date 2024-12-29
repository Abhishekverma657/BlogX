import express from 'express'
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose'
import connectDB from './DB/db.js'
import Userrouter from './routes/user.routes.js'
import postRouter  from  './routes/post.routes.js'
import cors from 'cors'
 


// coneect db 
connectDB()

const app= express()
app.use(cors({
    origin: 'http://localhost:5173', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed methods
    credentials: true // Allow cookies if needed
  }));
  
  // Your other middleware and routes
 ;
 

 
   app.use(express.json());

    app.get("/",(req, res)=>{
        res.send("running")
    })
     app.use("/api/user",Userrouter)
     app.use("/api/post", postRouter)


    app.listen(7000,()=>{
        console.log("server is running")
    })