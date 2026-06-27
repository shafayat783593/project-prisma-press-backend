import { NextFunction, Request, RequestHandler, Response } from "express";
import { catchAsync } from "../../utils/cashAsync";


const createComment = catchAsync(async (req: Request, res: Response, nest: NextFunction) => {
    
    
})
const gerCommentByAuthorId = catchAsync(async (req: Request, res: Response, nest: NextFunction) => {
    
    
})
const getCommentByCommentId =catchAsync(async (req: Request, res: Response, nest: NextFunction) => {
    
    
}) 
const updateComment = catchAsync(async (req: Request, res: Response, nest: NextFunction) => {
    
    
})

const deleteComment = catchAsync(async (req: Request, res: Response, nest: NextFunction) => {
    
    
})


const moderateComment = catchAsync(async (req: Request, res: Response, nest: NextFunction) => {
    
    
})

export const commentController = {
    createComment,
    gerCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment

}
