import express from "express";
import {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
} from "../controller/library/Book.controller.js";

const router = express.Router();

router.post("/", createBook);
router.get("/", getAllBooks);
router.get("/:id", getBookById);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;
