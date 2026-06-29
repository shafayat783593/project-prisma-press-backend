import { DEFAULT_CIPHERS } from "node:tls"
import { IcratePostPayload, IPostquery, IUpdatePostPayload } from "./post.interface"
import { prisma } from "../../lib/prisma"
import { error } from "node:console"
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
import { title } from "node:process"
import { PostWhereInput } from "../../../generated/prisma/models"

const createPost = async (payload: IcratePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })

    return result
}




const getAllPosts = async (query: IPostquery) => {

    // -------------------------------
    // Pagination
    // -------------------------------

    // Number of posts per page (default: 10)
    const limit = query.limit ? Number(query.limit) : 10

    // Current page (default: 1)
    const page = query.page ? Number(query.page) : 1

    // Calculate how many records to skip
    // Example:
    // page = 2, limit = 10
    // skip = (2 - 1) * 10 = 10
    const skip = (page - 1) * limit


    // -------------------------------
    // Sorting
    // -------------------------------

    // Sort field (default: createdAt)
    const sortBy = query.sortBy ? query.sortBy : "createdAt"

    // Sort order (default: descending)
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"


    // -------------------------------
    // Tag Parsing
    // -------------------------------

    // Query parameter comes as string
    // Example:
    // tag='["React","Node"]'
    //
    // Convert string into array
    const tages = query.tag
        ? JSON.parse(query.tag as string)
        : null

    // Ensure parsed value is actually an array
    const tagesArray = Array.isArray(tages)
        ? tages
        : []

console.log("tagesArray",tagesArray)
    // -------------------------------
    // Dynamic Filter Conditions
    // -------------------------------

    // Store all dynamic filters here.
    // Later these conditions will be used inside Prisma's AND clause.
    const andCondition: PostWhereInput[] = []


    // -------------------------------
    // Search Filter
    // -------------------------------

    // Search in title OR content
    if (query.searchTerm) {

        andCondition.push({

            OR: [

                {
                    title: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                },

                {
                    content: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                }

            ]

        })

    }


    // -------------------------------
    // Exact Title Filter
    // -------------------------------

    if (query.title) {

        andCondition.push({

            title: query.title

        })

    }


    // -------------------------------
    // Exact Content Filter
    // -------------------------------

    if (query.content) {

        andCondition.push({

            content: query.content

        })

    }


    // -------------------------------
    // Filter By Author
    // -------------------------------

    if (query.authorId) {

        andCondition.push({

            authorId: query.authorId

        })

    }


    // -------------------------------
    // Featured Posts Filter
    // -------------------------------

    if (query.isFeatured) {

        andCondition.push({

            // Convert string "true"/"false" into boolean
            isFeatured: query.isFeatured === "true"

        })

    }


    // -------------------------------
    // Tag Filter
    // -------------------------------

    // hasSome checks whether at least one tag matches.
    //
    // Example:
    //
    // Database tags:
    // ["React","Node","MongoDB"]
    //
    // Query:
    // ["Node","Next"]
    //
    // Result:
    // Match because "Node" exists.
    if (query.tag) {

        andCondition.push({

            tag: {

                hasSome: tagesArray

            }

        })

    }


    // -------------------------------
    // Status Filter
    // -------------------------------

    if (query.status) {

        andCondition.push({

            status: query.status

        })

    }


    // -------------------------------
    // Fetch Posts
    // -------------------------------

    const posts = await prisma.post.findMany({

        // Apply all filters
        where: {

            AND: andCondition

        },

        // Pagination
        take: limit,
        skip: skip,

        // Dynamic Sorting
        orderBy: {

            [sortBy]: sortOrder

        },

        // Include related data
        include: {

            // Include author information
            // Exclude password field
            author: {

                omit: {

                    password: true

                }

            },

            // Include all comments
            comments: true

        }

    })

    return posts

}


const getPostById = async (postId: string) => {

    // await prisma.post.update({
    //     where: {
    //         id: postId
    //     },
    //     data: {
    //         views: {
    //             increment: 1
    //         }
    //     },


    // })
    // throw new Error("Fake error")

    // const post = await prisma.post.findUniqueOrThrow({
    // where: { id: postId },
    // include: {
    //     author: {
    //         omit: { password: true }
    //     },
    //     comments: {
    //         where: {
    //             status:CommentStatus.APPROVED
    //         },
    //         orderBy: {
    //             createdAt:"desc"
    //         }
    //     },
    //     _count: {
    //         select: {
    //             comments:true
    //         }
    //     }
    // },
    // })

    const transcationResult = await prisma.$transaction(async (tx) => {

        await tx.post.update({
            where: {
                id: postId
            },
            data: {
                views: {
                    increment: 1
                }
            },
        })

        // throw new Error("fack erroro")
        const post = await tx.post.findUniqueOrThrow({
            where: { id: postId },
            include: {
                author: {
                    omit: { password: true }
                },
                comments: {
                    where: {
                        status: CommentStatus.APPROVED
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                },
                _count: {
                    select: {
                        comments: true
                    }
                }
            },
        })
        return post
    }

    );

    return transcationResult

}
const getMyPost = async (authorId: string) => {

    console.log("authoerId", authorId)
    const result = await prisma.post.findMany({
        where: { authorId: authorId },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            comments: true,
            author: {
                omit: { password: true }
            },
            _count: {
                select: {
                    comments: true
                }
            }
        }


    })
    console.log("post", result)
    return result

}

const updatePost = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId,

        }
    })
    if (!isAdmin && post?.authorId !== authorId) {
        throw new Error("You are not the owner of this post")

    }
    const result = await prisma.post.update({
        where: { id: postId },
        data: payload,
        include: {
            author: {
                omit: { password: true },

            },
            comments: true
        }
    })

    return result


}

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUnique({
        where: { id: postId },

    })
    if (!isAdmin && post?.authorId !== authorId) {
        throw new Error("You are not the owner of this post")
    }
    const result = await prisma.post.delete({
        where: { id: postId }

    })
    return null;

}

const getPostStats = async () => {
    const tranasctionResult = await prisma.$transaction(async (tx) => {
        // .....................manula approch....................................

        // const totalPosts = await tx.post.count();
        // const totalDraftPost = await tx.post.count({
        //     where: {
        //         status: PostStatus.DRAFT
        //     }
        // })
        // const totalPublishedPost = await tx.post.count({
        //     where: {
        //         status: PostStatus.PUBLISHED
        //     }
        // })
        // const totalArchivedPost = await tx.post.count({
        //     where: {
        //         status: PostStatus.AHCHIVED
        //     }
        // })
        // const totlaComments = await tx.comment.count();
        // const totalApprovedComment = await tx.comment.count({
        //     where: {
        //         status: CommentStatus.APPROVED
        //     }
        // })
        // const totalRejectComment = await tx.comment.count({
        //     where: {
        //         status: CommentStatus.REJECT
        //     }
        // });
        // // const allPost = await tx.post.findMany();
        // // let totlaPostviews = 0;
        // // allPost.forEach((post) => {
        // //     totlaPostviews = totlaPostviews + post.views

        // // })

        // const totalPostviewAggregate = await tx.post.aggregate({
        //     _sum: {
        //         views: true

        //     }
        // })

        // const totlaPostviews = totalPostviewAggregate._sum.views



        // return {
        //     totalPosts,
        //     totalDraftPost,
        //     totalPublishedPost,
        //     totalRejectComment,
        //     totalArchivedPost,
        //     totlaComments,
        //     totalApprovedComment,
        //     totlaPostviews,

        // }

        const [
            totalPosts,
            totalDraftPost,
            totalPublishedPost,
            totalRejectComment,
            totalArchivedPost,
            totlaComments,
            totalApprovedComment,
            totalPostviewAggregate,
        ] = await Promise.all([
            await tx.post.count(),

            await tx.post.count({
                where: {
                    status: PostStatus.PUBLISHED
                }
            }),
            await tx.post.count({
                where: {
                    status: PostStatus.DRAFT
                }
            }),
            await tx.post.count({
                where: {
                    status: PostStatus.AHCHIVED
                }
            }),

            await tx.comment.count(),

            await tx.comment.count({
                where: {
                    status: CommentStatus.APPROVED
                },

            }),

            await tx.comment.count({
                where: {
                    status: CommentStatus.REJECT
                }
            }),
            await tx.post.aggregate({
                _sum: {
                    views: true

                }
            }),


        ])
        return {
            totalPosts,
            totalDraftPost,
            totalPublishedPost,
            totalRejectComment,
            totalArchivedPost,
            totlaComments,
            totalApprovedComment,
            totlaPostviews: totalPostviewAggregate._sum.views

        }
    })

    return tranasctionResult


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
