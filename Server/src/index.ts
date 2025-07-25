import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes";
import {connectDb} from "./db/index.db";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.routes";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/message", messageRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDb();
});
