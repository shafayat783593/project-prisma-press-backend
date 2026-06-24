import bcrypt from "bcryptjs";
import httpStatus from 'http-status';
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/cashAsync";
import { sendResponse } from "../../utils/sendResponse";


const RegisterUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const payload = req.body
    const user = await userService.registerUserIntoDB(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: { user }
    })

})


const getMyprofile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userid = req.user?.id
    const profile = await userService.getMyProfileFromDB(userid as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile fetched successfully",
        data: { profile }
    })
})

const updateMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body
    const updateProfile = await userService.updateMyprofileInDB(userId, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User profile updated successfully",
        data:{updateProfile}
        
        
    })

})

export const userController = {
    RegisterUser,
    getMyprofile,
    updateMyProfile
}


