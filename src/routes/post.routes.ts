import {Router} from "express";
import protect from "../middlewares/authMiddleware";
import postController from "../controllers/post.controller";

const router = Router();

router.post("/create", protect, postController.createPost);
router.delete("/delete/:postId", protect, postController.deletePost);
router.put("/update/:postId", protect, postController.updatePost);

router.get("/my-posts", protect, postController.getMyPosts);

router.post("/like/:postId", protect, postController.likePost);

router.get("/all-posts", postController.getAllPosts);

export default router;
