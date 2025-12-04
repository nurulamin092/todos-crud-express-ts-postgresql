import { Request, Response } from "express";
import { todoService } from "./todo.service";

const createTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoService.createTodos(req.body);
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

const getAllTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoService.getAllTodos();

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
};

const getSingleTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoService.getSingleTodo(req.params.id!);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "todos not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "todos fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateTodo = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await todoService.updateTodo(user_id, title, req.params.id!);
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
};

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoService.deleteTodo(req.params.id as string);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted", data: null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};

export const todosController = {
  createTodos,
  getAllTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo,
};
