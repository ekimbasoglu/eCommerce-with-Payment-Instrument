const { Router } = require('express');
const app = Router();

exports.register = function (req, res) {
    const email = req.body.email,
        name = req.body.name,
        surname = req.body.surname,
        password = req.body.password;

    if (!email || !name || !surname || !password) {
        res.status(400).send('Field is missing');
    }
    const user = {
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: req.body.password,
    }
    // id-stamp-logic-here

    res.status(200).send('User logged in successfully');
};
exports.login = function (req, res) {
    // Handle registration logic
    const { username, password } = req.body;
    // Your registration logic here
    res.send('User registered successfully');
};

// Forgot password endpoint
exports.forgetpassword = function (req, res) {
    // Handle forgot password logic
    const { email } = req.body;
    // Your forgot password logic here
    res.send('Password reset instructions sent to your email');
};
