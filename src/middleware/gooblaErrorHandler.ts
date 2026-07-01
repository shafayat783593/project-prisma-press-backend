import { NextFunction, Request, Response } from "express"

import httpStatus from "http-status"
import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode;
    let errorMessage
    let errorName = err.name || "Internal server Error"
    let errorDetails = err.stack


    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST
        errorMessage = "You have provieded incorrect field type or missing fields"

    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === " P2002") {
            statusCode = httpStatus.BAD_REQUEST
            errorMessage = "Duplicate key Error"
        } else if (err.code === "P2003") {
            statusCode = httpStatus.BAD_REQUEST
            errorMessage = " Foreign key constraint failed"
        }
        else if (err.code === "2025") {
            statusCode = httpStatus.BAD_REQUEST
            errorMessage = "An operation failed because it depends on one or more recodes that were required but not found."
        }

    } else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = httpStatus.UNAUTHORIZED,
                errorMessage = "Authencation failed against database server plese check your Credentials"

        } else if (err.errorCode = "P1001") {
            statusCode = httpStatus.BAD_REQUEST,
                errorMessage = "Can't reach databse server"
        }

    } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR
        errorMessage = "Error occurred during quary execution"
    }


    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        name: errorName,
        message: errorMessage,
        errorDetails
    })
}