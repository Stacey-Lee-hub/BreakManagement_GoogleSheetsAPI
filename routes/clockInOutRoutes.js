import express from "express";
import { handleAttendance, batchHandleAttendance } from "../controllers/clockInOutController.js";

const router = express.Router();

router.post("/attendance", handleAttendance);
router.post("/batchAttendance", batchHandleAttendance);

export default router;