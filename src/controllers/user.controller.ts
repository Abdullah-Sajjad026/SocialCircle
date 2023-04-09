import {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import prisma from "../services/prisma";

const userController = {};

const index = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json({users});
});

/**
 * @desc    Get logged in user
 * @route   GET /api/v1/users/me
 * @access  Private
 */
const getMe = asyncHandler(async (req: Request, res: Response) => {
  const {user} = req.body;

  const {password, ...resUser} = user;

  res.status(200).json({
    status: true,
    message: "Record fetched successfully",
    data: {...resUser},
  });
});

/**
 * @desc    Get a user
 * @route   GET /api/v1/users/:userId
 * @access  Private
 */
const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.userId,
    },
  });

  res.json({user});
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/me
 * @access  Private
 */
const updateMe = asyncHandler(async (req: Request, res: Response) => {
  // protect middlewares ensures user on req.body.
  const {user, ...reqBody} = req.body;

  const newData = {...user, ...reqBody};

  const {password, ...updatedUser} = await prisma.user.update({
    data: {
      ...newData,
    },
    where: {
      id: user.id,
    },
  });

  res.status(200).json({
    status: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/users/me
 * @access  Private
 * @todo    Delete all posts and likes of the user
 *
 */
const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  const {user} = req.body;

  const deletedUser = await prisma.user.update({
    data: {isActive: false},
    where: {id: user.id},
  });

  if (deletedUser) {
    // delete user posts
    await prisma.post.updateMany({
      data: {isDeleted: true},
      where: {authorId: user.id},
    });

    // delete user likes
    await prisma.like.deleteMany({
      where: {userId: user.id},
    });

    res
      .status(200)
      .json({status: true, message: "Account deleted successfully"});
  } else throw new Error("Something went wrong");
});

export default Object.assign(userController, {
  index,
  getMe,
  getUser,
  updateMe,
  deleteMe,
});
