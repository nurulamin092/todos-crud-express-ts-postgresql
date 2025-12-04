import { Router } from "express";
import { todosController } from "./todo.controller";

const router = Router();

router.post("/", todosController.createTodos);
router.get("/", todosController.getAllTodos);
router.get("/:id", todosController.getSingleTodo);
router.put("/:id", todosController.updateTodo);
router.delete("/:id", todosController.deleteTodo);
export const todosRouter = router;
