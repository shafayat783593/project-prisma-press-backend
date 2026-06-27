import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { get } from "node:http";



const router = Router()
router.post("/", auth(Role.ADMIN, Role.USER), commentController.createComment)

router.get("/:commentId", commentController.getCommentByCommentId)
router.get('/author/authorId',commentController.gerCommentByAuthorId)
router.patch("/:commnetId", auth(Role.USER,Role.ADMIN), commentController.updateComment)
router.delete("/:commentId",auth(Role.ADMIN,Role.USER), commentController.deleteComment)
router.put("/:commentId/moderate",auth(Role.ADMIN),commentController.moderateComment)
export const commentRouter = router 