import { DEFAULT_CIPHERS } from "node:tls"
import { IcratePostPayload, IUpdatePostPayload } from "./post.interface"
import { prisma } from "../../lib/prisma"
import { error } from "node:console"
import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"

const createPost = async (payload: IcratePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    })

    return result
}

const getAllPosts = async () => {
    const posts = await prisma.post.findMany({
        //  filtering............................................

        // where: {
        //     title: "jlfd fosfjsfsdkfjsdjfskdfl",
        //     content:"Content of the post goes here."
        // },




        //   searching partial operator.........................
        // where: {
        //     OR: [
        //         {
        //             title: {
        //                 contains:"Ron",
        //                 mode:"insensitive"

        //             },

        //         },
        //         {
        //             content: {
        //                 contains: "Ron",
        //                 mode:"insensitive"
        //             }
        //         }
        //     ]
        // }

        // combining serach (Or operator ) and filtering (And).................................................

        where: {
            //   filterning combining serach (Or operator ) and filtering (And).................................

            AND: [
                {
                    // seraching.............
                    OR: [

                        {
                            title: {
                                contains: "Ron",
                                mode: 'insensitive'
                            }
                        },
                        {
                            content: {
                                contains: "ron",
                                mode: 'insensitive'
                            }
                        }


                    ]
                },
                // filtering ................



                //  যদি case-insensitive exact match করতে চাও



                {
                    title: {
                        equals: "Ronaldo",
                        mode: "insensitive",
                    },

                }
                ,

                // {
                //     title: "Ronaldo"
                // },
                // {
                //     content: "Ronaldo"
                // }
            ]
        }
        ,
        include: {
            author: {
                omit: { password: true }
            },
            comments: true,

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
