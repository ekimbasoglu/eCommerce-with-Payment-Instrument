const nodemailer = require('nodemailer');

// Create a transporter with your email service provider credentials
const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: 'ecommerse-reset-password@hotmail.com',
        pass: 'Test123124!_',
    },
});

module.exports = transporter;
