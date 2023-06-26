const { Router } = require('express');
const app = Router();
const userController = require('../controllers/User');
const userLoggedIn = require('../middlewares/userLoggedIn');

app.post('/login', userController.login);
app.post('/register', userController.register);
app.get('/logout', userLoggedIn, userController.logout);
// reset password

module.exports = app;
