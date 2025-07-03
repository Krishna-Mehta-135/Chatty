import {NextFunction, Request, Response} from "express";

type RequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (requestHandler: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            console.log("Error in asyncHandler:" + error);
            const err = error as {statusCode?: number; message?: string};
            res.status(err.statusCode && err.statusCode >= 100 && err.statusCode <= 600 ? err.statusCode : 500).json({
                success: false,
                message: err.message || "Internal Server Error",
            });
        }
    };
};
