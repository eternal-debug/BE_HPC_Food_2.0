const generateOtp = require('../utils/otp_generator');
const sendEmail = require('../utils/smtp_function');
const User = require('../models/user');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async (req, res) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({status: false, message: 'Email không hợp lệ'});
        }

        const minPasswordLength = 8;
        if (req.body.password < minPasswordLength) {
            return res.status(400).json({status: false, message: 'Mật khẩu phải tối thiểu ' + minPasswordLength + ' ký tự'});
        }

        try {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({status: false, message: 'Email đã tồn tại'});
            } 
            const otp = generateOtp();
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                userType: "Khách hàng",
                password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET).toString(),
                otp: otp
            })
            await newUser.save();
            await sendEmail(newUser.email, otp)
            res.status(201).json({status: true, message: "Tạo tài khoản thành công"}); 
        } catch (error) {
            res.status(500).json({status: false, message: error.message})  
        }
    },

    loginUser : async(req, res) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!emailRegex.test(req.body.email)){
            return res.status(400).json({status: false, message: 'Email không hợp lệ'});
        }

        const minPasswordLength = 8;

        if (req.body.password.length < minPasswordLength) {
            return res.status(400).json({status: false, message: 'Mật khẩu phải tối thiểu ' + minPasswordLength + ' ký tự'});
        }

        try {
            const user = await User.findOne({email: req.body.email});
            if(!user){
                return res.status(400).json({status: false, message: "Sai tài khoản hoặc mật khẩu"});
            }
            const decryptedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const depassword = decryptedPassword.toString(CryptoJS.enc.Utf8);

            if(depassword !== req.body.password){
                return res.status(400).json({status: false, message: "Sai tài khoản hoặc mật khẩu"}); 
            }
            const userToken = jwt.sign({
                id: user._id,
                userType: user.userType,
                email:  user.email,
            }, process.env.JWT_SECRET, {expiresIn: "30d"});
            const {password, createdAt, updatedAt, __v, otp, ...others} = user._doc;
            res.status(200).json({...others, userToken});
        } catch (error) {
           res.status(500).json({status: false, message: error.message}); 
        }
    },
}