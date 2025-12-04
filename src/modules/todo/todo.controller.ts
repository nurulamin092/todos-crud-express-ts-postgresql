import { Request, Response } from "express";
import { todoService } from "./todo.service";

const createTodos = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await todoService.createTodos(user_id, title);
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
};

export const todosController = {
  createTodos,
};
