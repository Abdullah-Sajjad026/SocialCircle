import express from "express";
import morgan from "morgan";
import multer from "multer";
import errorMiddleware from "./middlewares/errorMiddleware";
import {userRoutes} from "./routes";

class App {
  public server;

  private upload = multer();

  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({extended: true}));
    this.server.use(morgan("common"));
    this.server.use(this.upload.none());
  }

  routes() {
    this.server.use("/api/v1/users", userRoutes);

    this.server.use(errorMiddleware);
  }
}

export default new App().server;
