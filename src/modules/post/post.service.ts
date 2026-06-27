import { DEFAULT_CIPHERS } from "node:tls"
import { IcratePostPayload } from "./post.interface"
import { prisma } from "../../lib/prisma"

const createPost = async(payload:IcratePostPayload,userId:string) => {
    const result = await prisma.post.create({
        data:{
            ...payload,
            authorId:userId
        }
    })

    return result
}

const getAllPosts = async() => {
    const posts = await prisma.post.findMany({
        include: {
            author: {
                omit:{password:true}
            },
            comments:true,
            
        }
      

    })
    return posts

}



const getPostById = async(postId: string) => {
    const post = await prisma.post.findUniqueOrThrow({
        where:{id:postId}
    })

    const updatePost = await prisma.post.update({
        where: {
            id:postId
        },
        data: {
            views: {
                increment:1
            }
        },
        include: {
            author: {
                omit:{password:true}
            },
            comments:true
        },
        
    })

    return updatePost
}
const getMyPost = async(authorId:string) => {

    console.log("authoerId",authorId)
    const result = await prisma.post.findMany({
        where: {authorId: authorId },
        orderBy: {
            createdAt:"desc"
        },
        include: {
            comments: true,
            author: {
                omit:{password:true}
            },
            _count: {
                select: { 
                  comments:true
              }
          }
        }

        
    })
    console.log("post",result)
    return result
    
}

const updatePost = () => {
    
}

const deletePost = () => {
    
}

const getPostStats = () => {
    
}

export const postService = {
    createPost,
    getAllPosts,
    getPostById,
    getMyPost,
    updatePost,
    deletePost,
    getPostStats,
}
