import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/cashAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body
    const { accessToken, refreshToken } = await authServices.loginUser(payload);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge:1000  *60 * 60 *24     //1 houre or 1 day
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge:1000  *60 * 60 *24 *7    //1 houre or 7 day
    })
    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "User logged in successfully",
        data: { accessToken, refreshToken },

    })
})


const refreshtoken = catchAsync(async (req: Request, res: Response) => {
   const refreshtoken = req.cookies.refreshToken
    const { accessToken } = await authServices.refreshtoken(refreshtoken)

       res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge:1000  *60 * 60 *24     //1 houre or 1 day
    })
    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "RefreshToken is successfully",
        data:{accessToken}
    })
})

export const authController = {
    loginUser,
    refreshtoken,
}