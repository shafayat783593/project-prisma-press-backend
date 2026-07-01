import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/cashAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStarus from "http-status";

const createcheckoutSession = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id 

    const result = await subscriptionService.createCheckoutsession(userId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStarus.OK,
        message: "Checkout completed successfylly",
        data:result,
    })
})

export const subscriptionController = {
    createcheckoutSession
}