const { Router } = require('express');
const app = Router();
const userController = require('../controllers/User');

app.post('/login', userController.login);
app.post('/register', userController.register);

module.exports = app;
