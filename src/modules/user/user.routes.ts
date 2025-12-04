import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/", userController.createUser);

router.get("/", userController.getUser);

router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.updatedUser);

router.delete("/:id", userController.userDelete);

export const userRouter = router;
