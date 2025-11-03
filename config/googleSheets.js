import dotenv from "dotenv"; // ✅ Load environment variables
import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY, // ✅ From .env
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Write data to the Google Sheet
export const sheets = google.sheets({ version: "v4", auth });
export const spreadsheetId = process.env.GOOGLE_SHEET_ID;
