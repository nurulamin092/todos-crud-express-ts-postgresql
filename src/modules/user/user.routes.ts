import express from "express";
import { userController } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", userController.createUser);

router.get("/", logger, auth(), userController.getUser);

router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.updatedUser);

router.delete("/:id", userController.userDelete);

export const userRouter = router;
