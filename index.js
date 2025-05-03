import express from 'express';
import cors from 'cors';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectionDB from './Database/db.config.js';
import router from './Routers/CrudRoute.js';
dotenv.config();

const app = express();
const port = process.env.port

app.use(cors());
app.use(express.json());
connectionDB();
app.use('/api', router)
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);    
})