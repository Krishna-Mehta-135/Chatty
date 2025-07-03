import {asyncHandler} from "../utils/AsyncHandler";
import {Request} from "express";
import {Response} from "express";
import {loginUserSchema, registerUserSchema} from "../validation/user.validation";
import {ApiError} from "../utils/ApiError";
import User from "../models/user.model";
import {ApiResponse} from "../utils/ApiResponse";
import {Types} from "mongoose";
import jwt from "jsonwebtoken";

const generateToken = (userId: Types.ObjectId, res: Response) => {
    // token generation logic here
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign({userId}, jwtSecret, {
        expiresIn: "7d",
    });

    const cookieOptions = {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict" as const,
        secure: process.env.NODE_ENV !== "development",
    };

    res.cookie("jwt", token, cookieOptions);

    return token;
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    //Validate user
    const validationResult = registerUserSchema.safeParse(req.body);
    if (!validationResult.success) {
        throw new ApiError(400, "Enter correct credentials", validationResult.error.errors);
    }

    //Use validated data
    const {fullName, email, password} = validationResult.data;

    //Check if user exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
        throw new ApiError(403, "User already exists");
    }

    //Add user to the db
    const user = await User.create({
        fullName,
        email,
        password,
    });

    //Generate token
    const token = generateToken(user._id as Types.ObjectId, res);

    //Send response
    res.status(201).json(
        new ApiResponse(
            201,
            {
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                },
            },
            "User registered successfully"
        )
    );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    //Validate users
    const validationResult = loginUserSchema.safeParse(req.body);
    if (!validationResult.success) {
        throw new ApiError(400, "Enter correct credentials ", validationResult.error.errors);
    }

    //give validated data to db for search
    const {email, password} = validationResult.data;

    //Find user in db
    const user = await User.findOne({email});
    if (!user) {
        throw new ApiError(400, "Enter correct credentials");
    }

    //Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    //Generate token
    const token = generateToken(user._id as Types.ObjectId, res);

    //Send response
    res.status(200).json(
        new ApiResponse(
            200,
            {
                user: {
                    _id: user._id,
                    email: user.email,
                    fullName: user.fullName,
                },
            },
            "User logged in successfully"
        )
    );
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.jwt;
    if(!token){
        res.status(200).json(
            new ApiResponse(200, null, "Already logged out")
        );
        return;
    }
    res.cookie("jwt" , "" , {maxAge: 0})
    res.status(200).json(
        new ApiResponse(
            200,
            null,
            "User logged out successfully"
        )
    )
});

export {loginUser, registerUser, logoutUser};
