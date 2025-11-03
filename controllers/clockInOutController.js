import { findEmpId, getAttendanceEmpId, createRecord, updateRecord } from "../models/clockInOutModel.js";

export const handleAttendance = async (req, res) => {
    try {
        //  CODE THAT ONLY HANDLED ONE OBJECT COMMENTED DOWN BELOW
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

export const batchHandleAttendance = async (req, res) => {
    try {
        let records = req.body;

        // Allow single object or array
        if (!Array.isArray(records)) {
            records = [records];
        }

        const results = [];

        // using results.push cause there might be multiple errors and successes
        for (const record of records) {
            const {empId, type} = record;

            try {
                // Validation
                if (!empId || !type) {
                    results.push({
                        status: 400,
                        empId, 
                        error: "Missing empId or type"
                    });
                    continue;
                }

                // Check if employee exists
                const employee = await findEmpId(empId);
                if(!employee) {
                    results.push({
                        status: 404,
                        empId, 
                        error: "Employee not found"
                    });
                    continue;
                }

                // Check if employee already has a record
                const todaysRecord = await getAttendanceEmpId(empId, type);

                // If no record exists for this emp + type, create one
                if (!todaysRecord) {
                    const newRec = await createRecord(empId, type);
                    results.push({
                        status: 201,
                        empId,
                        message: `${type} clock-in created successfully`,
                        attendance: newRec
                    });
                    continue;
                }

                // If record exists, check if clock-out is already filled
                const clockOutTime = todaysRecord[2];
                if (clockOutTime) {
                    results.push({
                        status: 400,
                        empId,
                        error: `Already clocked out for ${type} today`,
                        attendance: todaysRecord
                    });
                    continue;
                }

                // Add 2 min buffer
                const clockInTime = todaysRecord[1];
                const clockIn = new Date(`1970-01-01T${clockInTime}`);
                const now = new Date();
                const diffTime = (now - clockIn) / 60000;

                if (diffTime < 2) {
                    results.push({
                        status: 400,
                        empId,
                        error: `You can only clock out after 2 minutes.Please wait ${Math.ceil(2 - diffTime)} more minutes(s)`
                    });
                    continue;
                }

                // If within valid time, update record
                const updatedRecord = await updateRecord(empId, type);
                results.push({
                    status: 200,
                    empId,
                    message: `${type} clock-out updated successfully`,
                    attendance: updatedRecord
                });
            } catch (innerE) {
                results.push({
                    status: 500,
                    empId,
                    error: "Error processing this record", 
                    details: innerE.message
                });
            }
        }

        // Respond once after processing all records
        return res.status(200).json({results});
    } catch (error) {
        console.error("❌ batchHandleAttendanceC error: ", error);
        res.status(500).json({message: "Server error", error: e.message});
    }
}