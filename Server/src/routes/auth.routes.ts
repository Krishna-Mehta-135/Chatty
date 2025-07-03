import express from "express";
import { loginUser, registerUser, logoutUser, updateProfile, checkAuth  } from "../controllers/auth.controller";
import { protect } from '../middlewares/auth.middleware';

const authRouter = express.Router()

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);

authRouter.put("/update-profile", protect, updateProfile)

authRouter.get("/check", protect, checkAuth)

export default authRouter;