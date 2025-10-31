import { db } from '../config/db.js';
import { generateQRCode } from '../services/generateQRService.js';
import { sendQREmail } from '../services/emailService.js';

const BASE_URL = "http://localhost:3000";

// Fx 1: Add QR for all employees
export const saveAllEmpQRCode = async () => {
    try {
        // get all employees
        const [employees] = await db.query("SELECT id, name, email FROM employees");

        for (const emp of employees) {
            const empId = emp.id;
            const scan_url = `${BASE_URL}/api/attendance/clockin/${emp.id}`;

            // generate QR code
            const qrbuffer = await generateQRCode(empId);

            // save to MySQL
            await db.query(
                `INSERT INTO qrcode(emp_id, scan_url, qr_image) VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                scan_url = VALUES(scan_url),
                qr_image = VALUES(qr_image)`,
                [empId, scan_url, qrbuffer]
            );

            // send email
            try {
                await sendQREmail(emp.email, emp.id, emp.name, qrbuffer);
                console.log(`Email sent and recorded successfully for ${empId}`);
            } catch (error) {
                console.error('Failed to send email');
            }
            
        }

        return {message: 'All employees QR codes generated and stored successfully'};        

        
    } catch (e) {
        console.error('Error saving QRCodesM: ', e);
        throw e;
    }
}

// Fx 2 : Add QR for single employee
export const saveEmpQRCode = async (empId) => {
    try {
        // get single employee
        const [[emp]] = await db.query("SELECT id, name, email FROM employees WHERE id = ?", [empId]);

        if (!emp) throw new Error(`Employee with ID ${empId} not found`);

        const scan_url = `${BASE_URL}/api/attendance/clockin/${emp.id}`;

        // generate QR code
        const qrbuffer = await generateQRCode(empId);

        // save to MySQL
        await db.query(
            `INSERT INTO qrcode(emp_id, scan_url, qr_image) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
            scan_url = VALUES(scan_url),
            qr_image = VALUES(qr_image)`,
            [empId, scan_url, qrbuffer]
            );

        // send email
        await sendQREmail(emp.email, emp.id, emp.name, qrbuffer);

        console.log(`Email sent and recorded successfully for ${empId}`);
        return {message: 'QR codes generated and stored successfully'};        

        
    } catch (e) {
        console.error('Error saving single employee QRCodesM: ', e);
        throw e;
    }
}