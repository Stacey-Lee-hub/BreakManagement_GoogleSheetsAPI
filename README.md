# Break & Work Management System

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00618A?style=for-the-badge&logo=mysql&logoColor=white)
![Google Sheets API](https://img.shields.io/badge/Google%20Sheets%20API-34A853?style=for-the-badge&logo=googlesheets&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-0078D4?style=for-the-badge&logo=gmail&logoColor=white)
![QRCode](https://img.shields.io/badge/QRCode-000000?style=for-the-badge&logo=QRCode&logoColor=white)

A **QR-based attendance and break management system** built with **Node.js**, **MySQL**, and the **Google Sheets API**.  
It enables employees to **clock in/out** for work and manage **tea/lunch breaks** via unique QR codes.

---
##  Tech Stack

- **Node.js** – Backend runtime  
- **Express.js** – REST API framework  
- **MySQL** – Employee & QR data storage  
- **Google Sheets API** – Attendance record storage  
- **Nodemailer** – Email service for QR delivery  
- **qrcode** – Generates unique QR codes  

---

## Features

-  **QR Code Integration** – Each employee receives a unique QR code via email.  
-  **Clock-In / Clock-Out Tracking** – Automatically records work sessions to Google Sheets.  
-  **Break Management** – Dedicated rows for tea and lunch breaks.  
-  **Dual Storage System**  
  >- **Google Sheets:** Stores attendance logs.  
  >- **MySQL:** Stores employee details & QR backups.  
-  **Email Notifications** – Sends unique QR codes to employees using Nodemailer.  
-  **Batch & Single Updates** – Handles both individual and batch attendance submissions.  
-  **Error Handling & Code Comments** – Clear and efficient documentation throughout.

---

## Database Structure

| Column   | Description                                         |
|-----------|-----------------------------------------------------|
| empid     | Employee ID (unique identifier)                     |
| time_in   | Clock-in time                                       |
| time_out  | Clock-out time                                      |
| type      | Record type (`Work`, `Tea`, `Lunch`)                |
| status    | Attendance status (defaults to `"OnTime"`)          |
| date      | Date of the record                                  |

> ⚠️ The **status** field is not yet fully implemented and currently defaults to `"OnTime"` (handled in `clockInOutModel.js`). ⚠️

---

##  How It Works

1. **Generate QR Codes**
   - Each employee receives a unique QR code via the `generateQRService`.
   - The QR is emailed to the employee and saved in MySQL for backup.

2. **Clock In / Out or Take a Break**
   - Employees scan their QR to record work, tea, or lunch activity.
   - The record is added to both MySQL and Google Sheets.

3. **Data Handling**
   - Supports **single** and **batch** record submissions.
   - Tested using **Thunder Client** for API validation.

---

## Installation

1. Git clone the url

```bash
git clone https://github.com/Stacey-Lee-hub/BreakManagement_GoogleSheetsAPI
```

2. Open the folder and open on Visual Studio Code

3. Install the project 
```bash
npm install
```

4. Create .env file to include your details

```bash
#MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=[your_password]
DB_NAME=attendanceMySQL
PORT=3000

#Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=[your_email]
EMAIL_PASS=[your_password]

# Google Sheets Configuration
GOOGLE_SHEET_ID=[your_id]
GOOGLE_SERVICE_ACCOUNT_KEY=[your_key]
GOOGLE_SHEET_RANGE=Sheet1!A:F
```

5. Run project
```bash
nodemon indexjs
```

##  Testing

-  **Thunder Client** used for endpoint testing  
-  Supports **single** and **batch** requests  
-  Includes error handling and console logs for debugging  

---

##  Future Improvements

-  Implement a full **status system** (`OnTime`, `Late`, `EarlyOut`, etc.)  
-  Add a **dashboard interface** for viewing attendance logs  
-  Enhance **Google Sheets synchronization** and record validation  
