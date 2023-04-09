import {Request, Response} from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import prisma from "../services/prisma";
import {generateToken} from "../utils/utils-functions";

/**
 * @description Register a new user
 * @access Public
 * @route  POST /api/v1/users/register
 */

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const {firstName, lastName, email, password} = req.body;

  if (!email || !password || !firstName || !lastName) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  // check if already exists
  const exists = await prisma.user.findUnique({where: {email}});

  if (exists) {
    res.status(400);
    throw new Error("A user is already registered with this email");
  }

  // hashing user entered password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      email,
      password: hashedPassword,
      profilePicture: "",
    },
    select: {
      password: false,
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  if (user) {
    const token = generateToken({id: user.id, email: user.email});
    res.status(200).json({
      message: "User registered successfully",
      data: {
        ...user,
        token,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @description Login a user
 * @access Public
 * @route  POST /api/v1/users/login
 */
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const {email, password} = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  // finding user with given email from db
  const user = await prisma.user.findUnique({
    where: {email},
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400);
    throw new Error("Invalid credentials");
  } else {
    const {password, ...resUser} = user;
    const token = generateToken({id: user.id, email: user.email});
    res.status(200).json({
      message: "Logged in successfully",
      data: {
        ...resUser,
        token,
      },
    });
  }
});

const activateUser = asyncHandler(async (req: Request, res: Response) => {
  const {userId} = req.params;

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive: true,
    },
  });

  if (user) {
    res.status(200).json({message: "User activated successfully"});
  }
});

export default Object.assign({}, {registerUser, loginUser, activateUser});
