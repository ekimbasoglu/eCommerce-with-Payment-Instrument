const mongoose = require("mongoose");

const Preorder = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: String, require: true },
    amount: { type: Number, default: 1 },
    hasStockReserved: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Preorder', Preorder);

