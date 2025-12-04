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

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM  todos`
    );

    res.status(200).json({
      success: true,
      message: "todos fetched successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.put("/todos/:id", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE todos SET user_id=$1, title=$2 WHERE id =$3 RETURNING *
      `,
      [user_id, title, req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "todos not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "todos updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//? delete todos list
app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id=$1 RETURNING *",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted", data: null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

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
