const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Product = new mongoose.Schema({
    name: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: String, require: true },
    stock: { type: Number, require: true, default: 0 },
    image: { type: String, default: '' }, // URL
});

module.exports = mongoose.model('Product', Product);

