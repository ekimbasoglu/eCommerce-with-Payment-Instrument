const { Router } = require('express');
const app = Router();
const userController = require('../controllers/User');

// Example route handler
app.post('/login', userController.login);
app.post('/register', userController.register);
app.post('/forgetpassword', userController.forgetpassword);

module.exports = app;
