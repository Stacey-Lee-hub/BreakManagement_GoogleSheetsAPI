import { findEmpId, getAttendanceEmpId, createRecord, updateRecord } from "../models/clockInOutModel.js";

export const handleAttendance = async (req, res) => {
    try {
        const {empId, type} = req.body;

        // Validate input
        if (!empId || !type) {
            return res.status(400).json({error: "Missing employee ID or type"});
        }

        // Check if employee exists on MySQL
        const employee = await findEmpId(empId);
        if(!employee) {
            return res.status(404).json({error: "Employee not found"})
        }

        // Check if employee already has a record
        const todaysRecord = await getAttendanceEmpId(empId, type);

        // If no record exists for this emp + type, create one
        if (!todaysRecord) {
            const record = await createRecord(empId, type);
            return res.status(201).json({
                message: `${type} clock-in created successfully`,
                attendance: record
            });
        }

        // If record exists, check if clock-out is already filled
        const clockOutTime = todaysRecord[2];
        if (clockOutTime) {
            return res.status(400).json({
                error: `Already clocked out for ${type} today`,
                attendance: todaysRecord
            });
        }

        // Add 2 min buffer
        const clockInTime = todaysRecord[1];
        const clockIn = new Date(`1970-01-01T${clockInTime}`);
        const now = new Date();
        const diffTime = (now - clockIn) / 60000;

        if (diffTime < 2) {
            return res.status(400).json({error: `You can only clock out after 2 minutes.Please wait ${Math.ceil(2 - diffTime)} more minutes(s)`});
        }   

        // If within valid time, update record
        const updatedRecord = await updateRecord(empId, type);
        return res.status(200).json({
            message: `${type} clock-out updated successfully`,
            attendance: updatedRecord
        });
    } catch (e) {
        console.error("❌ handleAttendanceC error: ", e);
        res.status(500).json({message: "Server error ", error: e.message});
    }
}