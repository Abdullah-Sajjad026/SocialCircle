import {Request} from "express";

export type TokenData = {
  data: {
    id: string;
    email: string;
  };
};

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}
