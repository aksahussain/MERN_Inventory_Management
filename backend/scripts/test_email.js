require('dotenv').config({ path: '../.env' });
const nodemailer = require('nodemailer');

const testEmail = async () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('MISSING_CREDENTIALS: Please fill in .env first.');
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_USER, // Send to self
        subject: 'Inventory App - SMTP Test',
        text: 'If you see this, your email configuration is working correctly!'
    };

    try {
        console.log(`Attempting to send email from ${process.env.EMAIL_USER}...`);
        await transporter.sendMail(mailOptions);
        console.log('SUCCESS: Email sent successfully!');
    } catch (error) {
        console.error('FAILED: Could not send email.');
        console.error(error.message);
    }
};

testEmail();
