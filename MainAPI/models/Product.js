const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);


const Product = new mongoose.Schema({
    id: { type: Number, default: 0, unique: true },
    name: { type: String, require: true },
    description: { type: String, require: true },
    stock: { type: Number, require: true, default: 0 },
    image: { type: String, default: '' }, // URL
});

Product.plugin(AutoIncrement, { inc_field: 'id' });

module.exports = mongoose.model('Product', Product);

