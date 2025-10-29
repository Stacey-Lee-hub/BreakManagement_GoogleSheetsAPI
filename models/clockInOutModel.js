import pool from '../config/db.js';
import { sheets, spreadsheetId } from '../config/googleSheets.js';

const sheetName = "Attendance";
// CHECK FOR THE STATUS!!

// Fx 1: Find emp via MySQL
export const findEmpId = async (empId) => {
    try {
        const [rows] = await pool.query("SELECT * FROM employees WHERE id = ?", [empId]);
        return rows.length ? rows[0] : null;
    } catch (e) {
        console.error('Error finding empIdM: ', e);
        throw e;
    }
}

// Fx 2: Get attendance for sing emp
export const getAttendanceEmpId = async (empId, type) => {
    try {
        const today = new Date().toISOString().split("T")[0]; //YYYY-MM-DD
        const range = `${sheetName}!A:F`;

        const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
        const rows = res.data.values || [];

        return rows.find(r => 
                            r[5] === today && 
                            r[0] === empId && 
                            r[3]?.toLowerCase() === type.toLowerCase()
                        ) || null;
    } catch (e) {
        console.error('Error getting employee attendanceM', e);
        throw e;
    }
    
}

// Fx 3: Create new record (Clock-in)
export const createRecord = async (empId, type) => {
    try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const timeIn = new Date().toLocaleTimeString("en-ZA", {timeZone: "Africa/Johannesburg"}); // HH:MM:SS

        // why array in array? That's just how Google Sheets API works
        // outer array -> list of rows
        // inner array -> list of columns
        const values = [
            [
                empId,
                timeIn,
                "",         //clockin
                type,       //clockout (empty for now)
                "OnTime",
                today
            ]
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:F`,
            valueInputOption: "USER_ENTERED",
            resource: {values}
        });

        // why is it written like this? where is clockout_time: now coming from if you leave it empty when inputing data?
        return {empId, type, clockin_time: timeIn, date: today}
    } catch (e) {
        console.error('Error creating recordM', e);
        throw e;
    }
    
}

// Fx 4: Update record (clock-out)
export const updateRecord = async (empId, type) => {
    try {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const timeOut = new Date().toLocaleTimeString("en-ZA", {timeZone: "Africa/Johannesburg"}); // HH:MM:SS
        const range = `${sheetName}!A:F`;

        const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
        const rows = res.data.values || [];

        // Find today's record for this empId + type (no clockout_time)
        const rowIndex = rows.findIndex((r) => 
                                                r[0] == empId &&
                                                r[4].toLowerCase() === type.toLowerCase() &&
                                                r[5] === today &&
                                                !r[2]

        );

        if (rowIndex === -1) throw new Error("No active record found for this break type");

        const updateRange = `${sheetName}!C${rowIndex + 1}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: updateRange,
            valueInputOption: "USER_ENTERED",
            resource: {values: [[timeOut]]}
        });

        return {empId, type, clockout_time: timeOut, date: today};
    } catch (e) {
        console.error('Error updating recordM', e);
        throw e;
    }
    
}