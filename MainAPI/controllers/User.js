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
        const privateKeyPath = path.join(__dirname, '../private.pem');
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
                                const token = jwt.sign({ user }, process.env.SECRET); // Generate a token
                                return res.status(200).json({ token });
                            } else {
                                return res.status(400).send('Password is wrong!');
                            }
                        });
                    } else {
                        try {
                            const match = await argon2.verify(user.password, password);
                            if (match == true) {
                                const token = jwt.sign({ user }, process.env.SECRET); // Generate a token
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
        const privateKeyPath = path.join(__dirname, '../private.pem');
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

                            res.status(200).send('User registered successfully').json(result);
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

