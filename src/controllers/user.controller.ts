import {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import prisma from "../services/prisma";

const userController = {};

const index = asyncHandler(async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json({users});
});

const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body.user;

  // const posts = await prisma.post.findMany({});
  // const likes = await prisma.like.findMany({});

  // console.log({posts, likes});

  const {password, ...resUser} = user;

  res.status(200).json({
    status: true,
    message: "Record fetched successfully",
    data: {...resUser},
  });
});

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.params.userId,
    },
  });

  res.json({user});
});

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

const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  const {user} = req.body;

  const deletedUser = await prisma.user.update({
    data: {isActive: false},
    where: {id: user.id},
  });

  if (deletedUser)
    res
      .status(200)
      .json({status: true, message: "Account deleted successfully"});
  else throw new Error("Something went wrong");
});

export default Object.assign(userController, {
  index,
  getMe,
  getUser,
  updateMe,
  deleteMe,
});
