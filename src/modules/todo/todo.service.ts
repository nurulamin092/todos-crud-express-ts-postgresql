import { pool } from "../../config/db";

const createTodos = async (user_id: string, title: string) => {
  const result = await pool.query(
    `
    INSERT INTO todos(user_id,title)VALUES($1,$2) RETURNING *
    `,
    [user_id, title]
  );
  return result;
};

export const todoService = {
  createTodos,
};
