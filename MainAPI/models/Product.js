const mongoose = require("mongoose");
const autoIncrement = require('./utils/mongoose-auto-increment');

const Product = new mongoose.Schema({
    id: { type: Number, default: 0, unique: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    stock: { type: Number, require: true, default: 0 },
    image: { type: String, default: '' }, // URL string
});

Product.plugin(autoIncrement.plugin, {
    model: 'Product',
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('Product', Product);

