import express from 'express';
import cors from 'cors';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectionDB from './Database/db.config.js';
import userRouter from './Routers/UserRouter.js';
import router from './Routers/CrudRoute.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
connectionDB();
app.use('/api', router)
app.use('/api/user', userRouter); 
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);    
})