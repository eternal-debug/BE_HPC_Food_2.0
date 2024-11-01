const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
            }
            const { password, __v, createdAt, ...userData } = user._doc;
            return res.status(200).json(userData);
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    verifyAccount: async (req, res) => {
        const userOtp = req.params.otp;
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
            }

            if (userOtp === user.otp) {
                user.verification = true;
                user.otp = 'empty';
                await user.save();
                const userToken = jwt.sign({
                    id: user._id,
                    userType: user.userType,
                    email:  user.email,
                }, process.env.JWT_SECRET, {expiresIn: "30d"});
                const { password, __v, otp, createdAt, ...others } = user._doc;
                return res.status(200).json({ ...others, userToken });

            } else {
                return res.status(400).json({ status: false, message: 'Sai OTP' });
            }
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    verifyPhone: async (req, res) => {
        const phone = req.params.phone;
        try {
            const phoneRegex = /^[0-9]{10,11}$/;
            if (!phoneRegex.test(phone)) {
                return res.status(400).json({ status: false, message: 'Số điện thoại không hợp lệ' });
            }
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
            }
            user.verification = true;
            user.phone = phone;
            await user.save();
            const userToken = jwt.sign({
                id: user._id,
                userType: user.userType,
                email:  user.email,
            }, process.env.JWT_SECRET, {expiresIn: "30d"});
            const { password, __v, otp, createdAt, ...others } = user._doc;
            return res.status(200).json({ ...others, userToken });
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.user.id);
            if (!user) {
                return res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
            }
            return res.status(200).json({ status: true, message: 'Xóa thành công' });
        } catch (error) {
            return res.status(500).json({ status: false, message: error.message });
        }
    },
}