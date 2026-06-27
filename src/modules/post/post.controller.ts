import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/cashAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from  "http-status"

const createPost = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id
    const payload = req.body
    const result = await postService.createPost(payload, userId as string)
    sendResponse(res, {
        success: true,
        message: "post create successfully",
        statusCode: httpStatus.CREATED,
        data:result
    })
})

const getAllPosts = catchAsync(async (req:Request, res: Response,next:NextFunction) => {
    const result = await postService.getAllPosts()
      sendResponse(res, {
        success: true,
        message: "Post  Retrived successfully",
        statusCode: httpStatus.OK,
        data:result
    })
})

const getPostById = catchAsync(async (req: Request, res: Response) => {
    const postId = req.params.postId
    if (!postId) {
        throw new Error("Post Id required In Params")

    }
    const result = await postService.getPostById(postId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "post retrived successfully",
        data: result
    })
}
)



const getMyPost =catchAsync(async (req: Request, res: Response) => {
    
    const authorId = req.user?.id
    const result = await postService.getMyPost(authorId as string)
     sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: " My post retrived successfully",
        data: result
    })
    
})
const updatePost = catchAsync(async (req: Request, res: Response) => {
    
})

const deletePost = catchAsync(async (req: Request, res: Response) => {
    
})

const getPostStats = catchAsync(async (req: Request, res: Response) => {
    
})



export const postController = {
    createPost,
       getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getPostStats,
    getMyPost,
}
