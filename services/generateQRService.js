import QRCode from 'qrcode';

/*
    Generates QR code as a Buffer for email attachment
    @param {string} Text to encode
    @returns {Promise<Buffer>} QR code image buffer
*/

// Generates QR with employee id
export const generateQRCode = async (text) => {
    try {
        return await QRCode.toBuffer(text, {
            type: 'image/png',
            width: 300,
            margin: 2,
            errorCorrectionLevel: 'H'
        })
    } catch (error) {
        console.error('Error generating QR code: ' + error);
        throw error
    }
}