import express from "express";
import { handleAttendance } from "../controllers/clockInOutController.js";

const router = express.Router();

router.post("/attendance", handleAttendance);

export default router;