const { Router } = require('express');
const app = Router();
const userController = require('../controllers/User');
const userLoggedIn = require('../middlewares/userLoggedIn');

app.post('/login', userController.login);
app.post('/register', userController.register);
app.post('/forgetpassword', userController.forgetpassword);
app.post('/forgetpassword/:token', userController.forgetpasswordafter);
app.get('/logout', userLoggedIn, userController.logout);
// reset password

module.exports = app;
