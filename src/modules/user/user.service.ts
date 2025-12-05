import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
const createUser = async (payload: Record<string, unknown>) => {
  const { name, role, email, password } = payload;

  const hasPassword = await bcrypt.hash(password as string, 10);
  const result = await pool.query(
    `
      INSERT INTO users(name,role,email,password) VALUES($1,$2,$3,$4) RETURNING *`,
    [name, role, email, hasPassword]
  );

  return result;
};

const getAllUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query(
    `
      SELECT * FROM users WHERE id=$1`,
    [id]
  );
  return result;
};

const updateUser = async (
  name: string,
  role: string,
  email: string,
  id: string
) => {
  const result = await pool.query(
    `
        UPDATE users SET name=$1, role=$2 email=$3 WHERE id=$4 RETURNING 
        *
        `,
    [name, role, email, id]
  );
  return result;
};

const userDeleted = async (id: string) => {
  const result = await pool.query(
    `
      DELETE FROM users WHERE id=$1`,
    [id]
  );
  return result;
};

export const userServices = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  userDeleted,
};
