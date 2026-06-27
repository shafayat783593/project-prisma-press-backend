import { NextFunction, Request, Response, Router } from "express";
import {  userController } from "./user.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";



const router = Router()



router.post("/register", userController.RegisterUser)

router.get("/me", auth(Role.USER), userController.getMyprofile)

router.put("/my-profile", auth(Role.USER), userController.updateMyProfile)

export const userRouter = router
