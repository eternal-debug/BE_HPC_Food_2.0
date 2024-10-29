const User = require('../models/user');
const Address = require('../models/address');

module.exports = {
    addAddress: async (req, res) => {
        try {
            const { addressLine1, default: isDefault, deliveryInstructions, latitude, longitude } = req.body;
            const newAddress = new Address({
                userId: req.user.id,
                addressLine1,
                default: isDefault,
                deliveryInstructions,
                latitude,
                longitude
            });

            if (isDefault) {
                await Address.updateMany({ userId: req.user.id }, { default: false });
            }

            await newAddress.save();
            res.status(201).json({ status: true, message: 'Địa chỉ đã được thêm' });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getAddress: async (req, res) => {
        try {
            const addresses = await Address.find({ userId: req.user.id });
            res.status(200).json(addresses);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    deleteAddress: async (req, res) => {
        try {
            const addressId = req.params.id;
            const address = await Address.findByIdAndDelete({ _id: addressId, userId: req.user.id });
            if (!address) {
                return res.status(400).json({ status: false, message: 'Địa chỉ không tồn tại' });
            }
            return res.status(200).json({ status: true, message: 'Xóa thành công' });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    setDefaultAddress: async (req, res) => {
        const addressId = req.params.id;
        const userId = req.user.id;
        try {
            await Address.updateMany({ userId }, { default: false });
            const updatedAddress = await Address.findByIdAndUpdate(addressId, { default: true });
            if (updatedAddress) {
                await User.findByIdAndUpdate(userId, { address: addressId });
                res.status(200).json({ status: true, message: 'Địa chỉ mặc định đã được cập nhật' });
            } else {
                return res.status(400).json({ status: false, message: 'Địa chỉ không tồn tại' });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getDefaultAddress: async (req, res) => {
        const userId = req.user.id;
        try {
            const address = await Address.findOne({userId: userId, default: true});
            if (!address) {
                return res.status(400).json({ status: false, message: 'Địa chỉ không tồn tại' });
            }
            res.status(200).json(address);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    updateAddress: async (req, res) => {
        try {
            const addressId = req.params.id;
            const { addressLine1, default: isDefault, deliveryInstructions, latitude, longitude } = req.body;
            const updatedAddress = await Address.findByIdAndUpdate(addressId, {
                addressLine1,
                default: isDefault,
                deliveryInstructions,
                latitude,
                longitude
            }, { new: true });
            if (!updatedAddress) {
                return res.status(400).json({ status: false, message: 'Địa chỉ không tồn tại' });
            }
            res.status(200).json({ status: true, message: 'Địa chỉ đã được cập nhật' });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
};