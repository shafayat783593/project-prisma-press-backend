import { Interface } from "node:readline";
import { PostStatus } from "../../../generated/prisma/enums";

export interface IcratePostPayload {
      
    title: string,
    content: string,
    thumbnail?: string,
    isFeatured?: boolean,
    status?: PostStatus,
    tag:string[]

}
  
export interface IUpdatePostPayload{
  title?: string,
  content?: string,
  thumbnail?: string,
  isFeatured?: boolean,
  status?: PostStatus,
  tag?: string[]
}