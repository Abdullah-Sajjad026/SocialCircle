import jwt from "jsonwebtoken";

export const generateToken = (data: {id: string; email: string}) => {
  const secret = process.env.JWT_SECRET_KEY!;
  return jwt.sign({data}, secret, {expiresIn: "1d"});
};
