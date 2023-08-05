const express = require('express');
const router = express.Router();
const cartController = require('../controllers/Cart');
const userLoggedIn = require('../middlewares/userLoggedIn');

// To view the transaction
router.get('/get/:userEmail', cartController.get);
router.post('/add/:productId', userLoggedIn, cartController.add);
// router.patch('/delete/:id', userLoggedIn, cartController.delete);

module.exports = router;
