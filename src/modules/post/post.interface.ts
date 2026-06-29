import { Interface } from "node:readline";
import { PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface IcratePostPayload {

  title: string,
  content: string,
  thumbnail?: string,
  isFeatured?: boolean,
  status?: PostStatus,
  tag: string[]

}

export interface IUpdatePostPayload {
  title?: string,
  content?: string,
  thumbnail?: string,
  isFeatured?: boolean,
  status?: PostStatus,
  tag?: string[]
}

export interface IPostQuary extends PostWhereInput {
  // title?: string,
  // content?: string,
  searchTerm?: string,
  page?: string,
  limit?: string,
  sortOrder?: string,
  sortBy?: string

}