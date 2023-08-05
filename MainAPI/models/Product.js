const mongoose = require("mongoose");

const Product = new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String },
    price: { type: String },
    amount: { type: Number, require: true, default: 0 },
    image: { type: String, default: '' }, // URL
});

module.exports = mongoose.model('Product', Product);

