import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

/*
    Send an email with embedded QR code
    @param {string} toEmail - Recipient email
    @param {string} empId
    @param {Buffer} qrCodeBuffer - QR code as Buffer
*/
export const sendQREmail = async (toEmail, empId, qrCodeBuffer) => {
    try {
        if (!qrCodeBuffer) {
            throw new Error('QR code Buffer is missing');
        }

        const mailOptions = {
            from: `"TimeSync" <${process.env.EMAIL_USER}`,
            to: toEmail,
            subject: "Welcome - Your QR Code",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #ffffff;">
                    <h2 style="color: #1a73e8; text-align: center;">Welcome to TimeSync!</h2>

                    <p style="color: #333;">Hi there,</p>
                    <p style="color: #333;">
                        We're thrilled to have you join the <strong>TimeSync</strong> team — your platform for seamless attendance and break management.
                    </p>

                    <p style="color: #333;">
                        Your unique employee id is: 
                        <strong style="color: #1a73e8; font-size: 16px;">${empId}</strong>
                    </p>

                    <p style="color: #333;">Please use the QR code below when clocking in/out:</p>

                    <div style="text-align: center; margin: 25px 0; padding: 15px; background: #f9fafc; border-radius: 6px;">
                        <!-- CID reference matches the filename below -->
                        <img src="cid:qrcode@timesync" alt="QR Code for ${empId}" 
                            style="width: 200px; height: 200px; display: block; margin: 0 auto; border: 1px solid #ddd; border-radius: 4px;">
                        <p style="font-size: 12px; color: #888; margin-top: 10px;">
                        Can't see the QR code? Please contact <a href="mailto:support@timesync.com" style="color: #1a73e8; text-decoration: none;">TimeSync Support</a>.
                        </p>
                    </div>

                    <p style="color: #333;">
                        For any questions or issues, feel free to reach out to our support team — we're here to help!
                    </p>

                    <p style="color: #888; text-align: center; margin-top: 30px;">
                        <em>– The TimeSync Team</em>
                    </p>
                </div>
            `,
            attachments: [{
                filename: 'registration-qrcode.png',
                content: qrCodeBuffer,
                cid: 'qrcode@timesync' //same CID referenced in the html img src
            }]
        };

        await transporter.sendMail(mailOptions);
        console.log(`QR code email sent to ${toEmail}`);
    } catch (error) {
        console.error('Error sending QR email :' + error);
        throw new Error('Failed to send QR code email');
    }
}