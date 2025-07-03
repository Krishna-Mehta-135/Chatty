import {User} from "../models/user.model";
import {ApiError} from "../utils/ApiError";
import {asyncHandler} from "../utils/AsyncHandler";
import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {IUser} from "../models/user.model";

// Extend Request interface to include user with proper typing
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
        throw new ApiError(401, "Token not found, please login");
    }

    if (!process.env.JWT_SECRET) {
        throw new ApiError(500, "JWT secret not configured");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user; // Now properly typed as IUser
        next();
        
    } catch (error) {
        throw new ApiError(401, "Invalid token");
    }
});
