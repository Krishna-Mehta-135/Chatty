import express from 'express';
import dotenv from "dotenv"
import authRouter from './routes/auth.routes';
import { connectDb } from './db/index.db';

dotenv.config()
const app = express();
app.use(express.json())

app.use("/api/v1/auth", authRouter)

app.listen(process.env.PORT ,() => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDb();
})