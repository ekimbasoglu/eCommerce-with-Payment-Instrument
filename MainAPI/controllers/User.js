const { Router } = require('express');
const app = Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = function (req, res) {
    const email = req.body.email,
        name = req.body.name,
        surname = req.body.surname,
        password = req.body.password;

    //Missing fields
    if (!email || !name || !surname || !password) {
        res.status(400).send('Field is missing');
        return;
    }


    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                res.status(400).send('User is already created');
            } else {
                const user = {
                    email,
                    name,
                    surname,
                    password,
                };
                const newUser = new User(user);
                newUser.save();
                const token = jwt.sign({ email }, process.env.SECRET); // Generate a token
                res.status(200).send('User registered successfully').json(token);
            }
        })
        .then(() => {
            console.log('Users saved');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};


exports.login = function (req, res) {
    const email = req.body.email,
        password = req.body.password;

    //Missing fields
    if (!email || !password) {
        res.status(400).send('Field is missing');
        return;
    }

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                if (user.password == password) {
                    const token = jwt.sign({ user }, process.env.SECRET); // Generate a token
                    res.status(200).json({ token });
                    return;
                } else {
                    res.status(400).send('Password is wrong!');
                    return;
                }
            } else {
                res.status(400).send('User doesnt exist!');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

// POST route for logging out and deleting the JWT token
exports.logout = async (req, res) => {
    var sess = req.session.user;

    if (req.user && req.user.deleteToken) {
        req.user.deleteToken(); // Invoke the deleteToken function to delete or invalidate the token
    }

    // Return a success message as the response
    res.json({ message: 'Logged out successfully' });
};

