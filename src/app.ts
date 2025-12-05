import express, { Request, Response } from "express";

import initDb from "./config/db";
import logger from "./middleware/logger";
import { userRouter } from "./modules/user/user.routes";
import { todosRouter } from "./modules/todo/todo.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();

initDb();

//? parser

app.use(express.json());

// app.use(express.urlencoded());

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Welcome to next level web development !");
});

// users crud

app.use("/users", userRouter);

//* todos crud

app.use("/todos", todosRouter);

//* auth route

app.use("/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
