const express = require('express');
const router = express.Router();
const cartController = require('../controllers/Cart');
const userLoggedIn = require('../middlewares/userLoggedIn');

// To view the transaction
router.get('/get/:userEmail', cartController.get);
router.post('/add', userLoggedIn, cartController.add);
router.post('/delete', userLoggedIn, cartController.remove);

module.exports = router;
