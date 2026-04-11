const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    resetOtp:String,
    otpExpiry:Date
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
module.exports = User;
