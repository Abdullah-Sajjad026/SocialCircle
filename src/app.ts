import express from "express";
import morgan from "morgan";
import {postRoutes, userRoutes} from "./routes";
import errorMiddleware from "./middlewares/errorMiddleware";
import {BASE_URL} from "./constants/config";
import upload from "./services/multer";

class App {
  public server;
  private upload = upload;

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
    this.server.use(`${BASE_URL}/users`, userRoutes);

    this.server.use(`${BASE_URL}/posts`, postRoutes);

    this.server.use(errorMiddleware);
  }
}

export default new App().server;
