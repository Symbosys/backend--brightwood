import express from "express";
import { createExpense, getAllExpenses, getExpenseById, updateExpense, deleteExpense, updateExpenseStatus } from "../controller/fees/Expense.controller.js";
const router = express.Router();
router.post("/", createExpense);
router.get("/", getAllExpenses);
router.get("/:id", getExpenseById);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);
router.patch("/:id/status", updateExpenseStatus);
export default router;
//# sourceMappingURL=expense.routes.js.map