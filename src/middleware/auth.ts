import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/cashAsync";
import config from "../config";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { Role } from "../../generated/prisma/client";
import { JwtPayload } from "jsonwebtoken";




declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string,
                name: string,
                id: string,
                role: Role
            }
        }
    }
}




export const auth = (...requiredRoles: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ?
            req.cookies.accessToken
            :
            req.headers.authorization?.startsWith("Bearer") ?
                req.headers.authorization?.split(" ")[1]
                : req.headers.authorization;

        if (!token) {
            throw new Error("You are not logged in . please log in to get access")
        }
        const verifiedToken = await jwtUtils.verifyToken(token, config.jwt_access_secret)

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        }

        const { email, id, role } = verifiedToken.data as JwtPayload
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("You do not have permission to perform this action");
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
                email,
                role,

            }

        })
        console.log("user", user)
        if (!user) {
            throw new Error("User not found")
        }

        if (user?.activeStatus === "BLOCKED") {
            throw new Error("You are blocked by admin. Please contact admin to get access")
        }

        req.user = user
        next();
    });


};

