const express = require('express');
const router = express.Router();
const PreorderController = require('../controllers/Preorder');
const userLoggedIn = require('../middlewares/userLoggedIn');

// To view the transaction
router.get('/get', productController.get);
// User to place preorder transaction
router.post('/submit', verifyAdminRole, productController.post);
// User to delete the preorder
router.patch('/delete/:id', verifyAdminRole, productController.delete);

module.exports = router;
