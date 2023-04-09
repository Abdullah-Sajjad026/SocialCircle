import {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import prisma from "../services/prisma";

/**
 * @desc    Create a post
 * @route   POST /api/v1/posts
 * @access  Private
 * @author  Abdullah-Sajjad026
 */
const createPost = asyncHandler(async (req: Request, res: Response) => {
  const {user, ...reqBody} = req.body;

  if (!reqBody.content.trim()) {
    res.status(400);
    throw new Error("Post content is required");
  }
  const post = await prisma.post.create({
    data: {
      content: reqBody.content,
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  res.status(201).json({post, message: "Post created successfully"});
});

/**
 * @desc    Delete a post
 * @route   DELETE /api/v1/posts/:postId
 * @access  Private
 * @author  Abdullah-Sajjad026
 */
const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const {user} = req.body;
  const {postId} = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.authorId !== user.id) {
    res.status(403);
    throw new Error("You are not authorized to delete this post");
  }

  await prisma.post.update({
    data: {
      isDeleted: true,
    },
    where: {
      id: postId,
    },
  });

  res.status(200).json({message: "Post deleted successfully"});
});

/**
 * @desc    Update a post
 * @route   PUT /api/v1/posts/:postId
 * @access  Private
 * @author  Abdullah-Sajjad026
 */
const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const {user, ...reqBody} = req.body;
  const {postId} = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  if (post.authorId !== user.id) {
    res.status(403);
    throw new Error("You are not authorized to update this post");
  }

  if (!reqBody.content.trim()) {
    res.status(400);
    throw new Error("Post content is required");
  }

  const updatedPost = await prisma.post.update({
    data: {
      content: reqBody.content,
    },
    where: {
      id: postId,
    },
  });

  res
    .status(200)
    .json({message: "Post updated successfully", post: updatedPost});
});

/**
 * @desc    Get a user's posts
 * @route   GET /api/v1/posts/my-posts
 * @access  Private
 * @author  Abdullah-Sajjad026
 * @todo    Add pagination
 * @todo    Add sorting
 *
 */
const getMyPosts = asyncHandler(async (req: Request, res: Response) => {
  const {user} = req.body;
  const posts = await prisma.post.findMany({
    where: {
      authorId: user.id,
      isDeleted: false,
    },
    select: {
      id: true,
      content: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
      likes: {select: {id: true, userId: true}},
      author: {select: {firstName: true, lastName: true, profilePicture: true}},
      _count: {select: {likes: true}},
    },
    // alternative to select
    // include: {
    //   _count: {select: {likes: true}},
    //   author: {select: {firstName: true, lastName: true, profilePicture: true}},
    //   likes: {select: {id: true, userId: true}},
    // },
  });

  res.status(200).json({message: "Posts fetched successfully", posts});
});

/**
 * @desc    Like a post
 * @route   POST /api/v1/posts/like/:postId
 * @access  Private
 * @author  Abdullah-Sajjad026
 */
export const likePost = asyncHandler(async (req: Request, res: Response) => {
  const {user} = req.body;
  const {postId} = req.params;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const like = await prisma.like.findFirst({
    where: {
      postId,
      userId: user.id,
    },
  });

  if (like) {
    await prisma.like.delete({
      where: {
        id: like.id,
      },
    });
    res.status(200).json({message: "Post unliked successfully"});
  }

  if (!like) {
    await prisma.like.create({
      data: {
        // alternative example
        // user: {
        //   connect: {
        //     id: user.id,
        //   },
        // },
        // post: {
        //   connect: {
        //     id: postId,
        //   },
        // },

        userId: user.id,
        postId,
      },
    });

    res.status(200).json({message: "Post liked successfully"});
  }
});

const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    where: {
      isPublic: true,
      isDeleted: false,
    },
  });

  res.status(200).json({message: "Posts fetched successfully", posts});
});

// exporting all the functions
export default {
  createPost,
  deletePost,
  updatePost,
  getMyPosts,
  likePost,
  getAllPosts,
};
