const mongoose = require("mongoose");


const User = new mongoose.Schema({
    email: { type: String, require: true },
    name: { type: String, require: true },
    surname: { type: String, require: true },
    password: { type: String, require: true },
    basket: { type: Array },
    selectedPaymentMethodId: { type: String },
    address: { type: String },
    roles: { type: String, default: 'User' }
});
// const Admin = new Schema({
//     email: { type: String, require: true },
//     name: { type: String, require: true },
//     surname: { type: String, require: true },
//     password: { type: String, require: true },
//     roles: "Admin"
// });


const UserModel = mongoose.model('User', User);

// const adminModel = mongoose.model("Admin", Admin);

module.exports = UserModel;