import express, { Request, Response } from "express";
import config from "./config";

import initDb, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRouter } from "./modules/user/user.routes";
import { todosRouter } from "./modules/todo/todo.routes";

const app = express();
const port = config.port;

initDb();

//? parser

app.use(express.json());

// app.use(express.urlencoded());

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Welcome to next level web development !");
});

// users crud

app.use("/users", userRouter);

//* todos create

app.use("/todos", todosRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
