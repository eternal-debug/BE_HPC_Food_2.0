const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail(userEmail, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: userEmail,
        subject: 'HPC Food - OTP xác nhận',
        html: `<h1>Xác nhận OTP</h1>
               <p>Mã OTP của bạn là:</p>
               <h2 style="color: red;">${message}</h2>
               <p>Nhập mã này vào trang xác nhận để hoàn tất quá trình đăng ký của bạn.</p>
               <p>Vui lòng bỏ qua email này, nếu bạn không yêu cầu OTP.</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email xác nhận đã được gửi đi');
    } catch (error) {
        console.error('Lỗi khi gửi email:', error.message);
    }
}

module.exports = sendEmail;
