import pool from '../config/db.js';
import { generateQRCode } from '../services/generateQRService.js';
import { sendQREmail } from '../services/emailService.js';

const BASE_URL = "http://localhost:3000";

// Fx 1: Add QR
export const saveQRCode = async (empId) => {
    try {
        // generate QR code
        const qrbuffer = await generateQRCode(empId);

        
    } catch (e) {
        console.error('Error finding empIdM: ', e);
        throw e;
    }
}