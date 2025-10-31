import express from "express";
import { generateAllQR, generateQRforEmp } from "../controllers/QRController";

const router = express.Router();

router.post("/:empId", generateQRforEmp);
router.post("/generate-all", generateAllQR);

export default router;