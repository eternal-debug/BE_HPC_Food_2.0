const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true, default: 'empty' },
    fcm: { type: String, required: true, default: 'empty' },
    password: { type: String, required: true },
    verification: { type: Boolean, default: false },
    phone: { type: String, default: '0987654321' },
    phoneVerification: { type: Boolean, default: false },
    address: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: false
    },
    userType: {
        type: String,
        required: true,
        default: 'Khách hàng',
        enum: ['Khách hàng', 'Quản trị viên', 'Cửa hàng', 'Shipper']
    },
    profile: { type: String, default: 'https://static-00.iconduck.com/assets.00/avatar-default-icon-2048x2048-h6w375ur.png' },
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);