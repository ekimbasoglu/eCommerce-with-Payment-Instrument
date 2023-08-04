const { Router } = require('express');
const app = Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();
const useRS256 = process.env.CUSTOMPREF_USERS256 ? process.env.CUSTOMPREF_USERS256 : false;
const useSalt = process.env.CUSTOMPREF_USESALT ? process.env.CUSTOMPREF_USESALT : false;
const argon2 = require('argon2');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const transporter = require('../middlewares/mailer');

// To hash the password with Argon2, instead salting
async function hashPassword(password) {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        // Handle hashing error
        throw new Error('Password hashing failed');
    }
}

exports.register = async (req, res) => {
    const email = req.body.email,
        name = req.body.name,
        surname = req.body.surname,
        password = req.body.password;

    //Missing fields
    if (!email || !name || !surname || !password) {
        res.status(400).send('Field is missing');
        return;
    }

    var hashedPassword; // undef
    if (useSalt === 'true') {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);
        hashedPassword = await bcrypt.hash(password, salt);
    } else {
        // Using argon2
        hashedPassword = await hashPassword(password);
    }

    if (useRS256 === 'false') {
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    res.status(400).send('User is already created');
                } else {
                    const user = {
                        email,
                        name,
                        surname,
                        password: hashedPassword,
                    };
                    const newUser = new User(user);
                    newUser.save();
                    const token = jwt.sign({ user }, process.env.SECRET); // Generate a token
                    res.status(200).send('User registered successfully').json(token);
                }
            })
            .then(() => {
                console.log('Users saved');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        // Using RS256
        const path = require('path');
        const privateKeyPath = path.join(__dirname, '../key.pem');
        const fs = require('fs');
        const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    res.status(400).send('User is already created');
                } else {
                    const user = {
                        email,
                        name,
                        surname,
                        password: hashedPassword,
                    };
                    const newUser = new User(user);
                    newUser.save();
                    // Store the token or send it as a response
                    const token = jwt.sign({ email }, privateKey, { algorithm: 'RS256' });

                    res.status(200).send('User registered successfully').json(token);
                }
            })
            .then(() => {
                console.log('Users saved');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
};


exports.login = function (req, res) {
    const email = req.body.email,
        password = req.body.password;

    //Missing fields
    if (!email || !password) {
        res.status(400).send('Field is missing');
        return;
    }


    if (useRS256 === 'false') {
        User.findOne({ email: req.body.email })
            .then(async (user) => {
                if (user) {
                    // Using salt

                    if (useSalt === 'true') {
                        bcrypt.compare(password, user.password, (err, result) => {
                            if (err) {
                                return res.status(400).send('Something is wrong!');
                            } else if (result) {
                                const token = jwt.sign({ user }, process.env.SECRET);

                                return res.status(200).json({ token });
                            } else {
                                return res.status(400).send('Password is wrong!');
                            }
                        });
                    } else {
                        try {
                            const match = await argon2.verify(user.password, password);

                            if (match == true) {
                                const token = jwt.sign({ user }, process.env.SECRET);

                                return res.status(200).json({ token });
                            } else {
                                return res.status(400).send('Password is wrong!');
                            }
                        } catch (err) {
                            return res.status(400).send('Something is wrong!');
                        }
                    }
                } else {
                    return res.status(400).send('User doesnt exist');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } else {
        // Using RS256
        const path = require('path');
        const privateKeyPath = path.join(__dirname, '../key.pem');
        const fs = require('fs');
        const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (err) {
                            return res.status(400).send('Something is wrong!');
                        } else if (result) {
                            const token = jwt.sign({ email }, privateKey, { algorithm: 'RS256' });
                            return res.status(200).json({ token });
                        } else {
                            return res.status(400).send('Password is wrong!');
                        }
                    });
                } else {
                    return res.status(400).send('User doesnt exist');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }
};

// POST route for logging out and deleting the JWT token
exports.logout = async (req, res) => {
    if (req.user && req.user.deleteToken) {
        req.user.deleteToken(); // Invoke the deleteToken function to delete or invalidate the token
    }

    // Return a success message as the response
    res.json({ message: 'Logged out successfully' });
};

exports.forgetpassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a random reset password token and store it in the user's document
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expiration time: 1 hour

        await user.save();

        // Send the reset password email to the user's email
        const mailOptions = {
            from: 'ecommerse-reset-password@hotmail.com',
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://localhost:4200/resetpassword?token=${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            }
            console.log('Email sent:', info.response);
            res.json({ message: 'Reset password link sent to your email' });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.forgetpasswordafter = async (req, res) => {

    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired reset token' });
        }

        var hashedPassword;

        if (useSalt === 'true') {
            // Generate a salt
            const salt = await bcrypt.genSalt(saltRounds);
            hashedPassword = await bcrypt.hash(newPassword, salt);
        } else {
            // Using argon2 to hash the password
            hashedPassword = await hashPassword(newPassword);
        }

        // Update the user's password and clear the reset password token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
