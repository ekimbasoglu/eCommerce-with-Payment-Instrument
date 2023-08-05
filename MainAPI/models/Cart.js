const mongoose = require("mongoose");
const productSchema = require('../models/Product');


const Cart = new mongoose.Schema({
    userEmail: { type: String, require: true },
    products: { type: [productSchema.schema], require: true }
});

module.exports = mongoose.model('Cart', Cart);

