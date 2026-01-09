import express from "express";
import {
    issueBook,
    returnBook,
    getAllIssues,
    getIssueById,
    deleteIssue
} from "../controller/library/BookIssue.controller.js";

const router = express.Router();

router.post("/issue", issueBook);
router.post("/return/:id", returnBook);
router.get("/", getAllIssues);
router.get("/:id", getIssueById);
router.delete("/:id", deleteIssue);

export default router;
