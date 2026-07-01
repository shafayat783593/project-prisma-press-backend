
import cookieParser from 'cookie-parser';
import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import config from "./config";
import { prisma } from './lib/prisma';
import { userRouter } from './modules/user/user.route';
import { authRouter } from './modules/auth/auth.route';
import { commentRouter } from './modules/comment/comment.route';
import { postRouter } from './modules/post/post.route';
import path from 'node:path';
import { notFound } from './middleware/notFound';
import httpStatus from "http-status"
import { globalErrorHandler } from './middleware/gooblaErrorHandler';
import { subscriptionRoute } from './modules/subscription/subscription.route';
const app:Application = express()
app.use(cors({
    origin: config.app_url,
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


app.get("/", async (req: Request, res: Response) => {
  const user = await prisma.user.findMany()
  console.log(user)
  res.json(user);
})

app.use("/api/users",userRouter)
app.use("/api/auth", authRouter)
app.use("/api/posts",postRouter)
app.use("/api/comments", commentRouter)
app.use("/api/subscription",subscriptionRoute)

app.use(notFound)

app.use(globalErrorHandler)


export default app