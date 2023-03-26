import {NextFunction, Request, Response} from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import {TokenData} from "../constants/types";
import prisma from "../services/prisma";

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      res.status(400);
      throw new Error("Invalid authorization header");
    } else {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY!
      ) as TokenData;

      if (!decoded) {
        res.status(400);
        throw new Error("Auth token is not valid");
      }

      const user = await prisma.user.findUnique({where: {id: decoded.data.id}});

      if (!user) {
        res.status(400);
        throw new Error("No user found");
      } else {
        if (!user.isActive) {
          res.status(400);
          throw new Error("The account doesn't exist");
        } else {
          req.body.user = user;
          next();
        }
      }
    }

    if (!token) {
      res.status(400);
      throw new Error("Not authorized, no token provided");
    }
  }
);

export default protect;
