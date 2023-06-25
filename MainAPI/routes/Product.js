const { Router } = require('express');
const app = Router();
const productController = require('../controllers/Product');

app.get('/get', productController.get);
app.post('/post', verifyAdminRole, productController.create);
app.patch('/patch', verifyAdminRole, productController.patch);
app.patch('/delete', verifyAdminRole, productController.delete);

module.exports = app;
