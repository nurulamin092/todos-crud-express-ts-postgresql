import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";
import { error } from "console";
import { hasSubscribers } from "diagnostics_channel";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const app = express();
const port = 5000;

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    age INT,
    phone VARCHAR(15),
    address TEXT,
    create_at TIMESTAMP DEFAULT NOW(),
    update_at TIMESTAMP DEFAULT NOW()
  )`);

  await pool.query(
    `
    CREATE TABLE IF NOT EXISTS todos(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    create_at TIMESTAMP DEFAULT NOW(),
    update_at TIMESTAMP DEFAULT NOW()
    )
    `
  );
};

initDb();

//middleware

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString}] ${req.method} ${req.path}\n`);
  next();
};
//? parser

app.use(express.json());

// app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to next level web development !");
});

app.post("/users", async (req: Request, res: Response) => {
  console.log(req.body);
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO users(name,email) VALUES($1,$2) RETURNING *`,
      [name, email]
    );

    // console.log(result.rows[0]);

    res.status(201).json({
      success: false,
      message: "Data insert successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      success: false,
      message: "User retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      details: err,
    });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id=$1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: " User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
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

app.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `
        UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING 
        *
        `,
      [name, email, req.params.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
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

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      DELETE FROM users WHERE id=$1`,
      [req.params.id]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

//* todos create

app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(
      `
    INSERT INTO todos(user_id,title)VALUES($1,$2) RETURNING *
    `,
      [user_id, title]
    );
    res.status(201).json({
      success: true,
      message: "todos create successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
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
