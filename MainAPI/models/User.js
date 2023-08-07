const mongoose = require("mongoose");


const User = new mongoose.Schema({
    email: { type: String, require: true },
    name: { type: String, require: true },
    surname: { type: String, require: true },
    password: { type: String, require: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    roles: { type: String, default: 'User' }
});

const UserModel = mongoose.model('User', User);

module.exports = UserModel;
