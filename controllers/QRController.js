import { saveEmpQRCode, saveAllEmpQRCode } from "../models/QRModel.js";

export const generateAllQR = async(req, res) => {
    try {
        // Generate all QR through model
        const result = await saveAllEmpQRCode();
        res.status(200).json(result.message);
    } catch (error) {
        console.error('Error in generateAllQRC:', error);
        res.status(500).json({error: 'Failed to generate all QR codes'});
    }
}

export const generateQRforEmp = async(req, res) => {
    try {
        // Ensure employee id is in parameters
        const {empId} = req.params;
        if (!empId) {
            return res.status(404).json({message: 'Employee ID required'});
        };

        // Generate QR through model
        const result = await saveEmpQRCode(empId);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in generateQRforEmpC:', error);
        res.status(500).json({error: 'Failed to generate QR code for employee'});
    }
}