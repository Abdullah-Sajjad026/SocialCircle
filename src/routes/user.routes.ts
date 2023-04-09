import express from "express";
import protect from "../middlewares/authMiddleware";
import authController from "../controllers/auth.controller";
import userController from "../controllers/user.controller";

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

router.get("/dev/activate/:userId", authController.activateUser);

router.get("/me", protect, userController.getMe);
router.put("/me", protect, userController.updateMe);
router.delete("/me", protect, userController.deleteMe);

export default router;
