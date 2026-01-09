import express from "express";
import { createSection, deleteSection, getAllSections, getSectionById, updateSection } from "../controller/student/Section.controller.js";
 const router = express.Router();   
 
router.post("/", createSection);        
router.get("/", getAllSections);        
router.get("/:id", getSectionById);        
router.put("/:id", updateSection);        
router.delete("/:id", deleteSection);        

export default router;          