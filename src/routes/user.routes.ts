import express from "express";
import protect from "../middlewares/authMiddleware";
import authController from "../controllers/auth.controller";
import userController from "../controllers/user.controller";

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/me", protect, userController.getMe);

// router.get("/:userId", userController.getUser);
router.put("/", protect, userController.updateUser);
router.delete("/", protect, userController.deleteUser);

export default router;
