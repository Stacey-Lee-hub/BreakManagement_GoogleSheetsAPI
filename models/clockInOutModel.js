import pool from '../config/db.js';
import { sheets, spreadsheetId } from '../config/googleSheets.js';

const sheetName = "Attendance";

// Fx 1: Find emp via MySQL
export const findEmpId = async (empId) => {
    const [rows] = await pool.query("SELECT * FROM employees WHERE id = ?", [empId]);
    return rows.length ? rows[0] : null;
}

// Fx 2: Get attendance for sing emp
export const getAttendanceEmpId = async (empId) => {
    // what is the date it's getting, in terms of structure?
    const today = new Date().toISOString().split("T")[0];
    const range = `${sheetName}!A:G`;

    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = res.data.values || [];

    return rows.find(r => r[5] === today && r[0] === empId) || null;
}

// Fx 3: Create new record (Clock-in)
export const createRecord = async (empId, type) => {
    const today = new Date().toISOString().split("T")[0];
    const timeIn = new Date().toLocaleTimeString("en-ZA", {timeZone: "Africa/Johannesburg"});

    // why array in array?
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

    // why is it written like this? where is clokout_time: now coming from if you leave it empty when inputing data?
    return {empId, type, clockout_time: now, date: today}
}