import express from "express";
import { generateAllQR, generateQRforEmp } from '../controllers/QRController.js';

const router = express.Router();

router.post("/qrcode/:empId", generateQRforEmp);
router.post("/qrcode/generate-all", generateAllQR);

export default router;