const Cart = require('../models/cart');

module.exports = {
    addProductToCart: async (req, res) => {
        try {
            const userId = req.user.id;
            const { productId, totalPrice, quantity, additives } = req.body;
            if (quantity <= 0) {
                return res.status(400).json({ status: false, message: "Số lượng không hợp lệ" });
            }
            const existingProduct = await Cart.findOne({ userId, productId });
            if (existingProduct) {
                existingProduct.quantity += quantity;
                existingProduct.totalPrice = (existingProduct.totalPrice / existingProduct.quantity) * existingProduct.quantity + totalPrice * quantity;
                existingProduct.additives = [...new Set([...existingProduct.additives, ...additives])];
                await existingProduct.save();
                return res.status(200).json({ status: true, count: await Cart.countDocuments({ userId }) });
            } else {
                const newCartItem = new Cart({
                    userId,
                    productId,
                    totalPrice: totalPrice * quantity, 
                    quantity,
                    additives: [...new Set(additives)] 
                });
                await newCartItem.save();
                return res.status(201).json({ status: true, count: await Cart.countDocuments({ userId }) });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    removeCartItem: async (req, res) => {
        try {
            const cartItemId = req.params.id;
            const userId = req.user.id;
            const deletedCartItem = await Cart.findByIdAndDelete({ _id: cartItemId, userId });
            if (!deletedCartItem) {
                return res.status(404).json({ status: false, message: 'Không tìm thấy trong giỏ hàng' });
            }
            return res.status(200).json({ status: true, count: await Cart.countDocuments({ userId }) });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getCart: async (req, res) => {
        try {
            const userId = req.user.id;
            const cart = await Cart.find({ userId })
                .populate({
                    path: 'productId',
                    select: 'imageUrl title restaurant rating ratingCount',
                    populate: {
                        path: 'restaurant',
                        select: 'time description'
                    }
                })
                .sort({ createdAt: -1 });
            return res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },  

    getCartCount: async (req, res) => {
        try {
            const userId = req.user.id;
            const count = await Cart.countDocuments({ userId });
            return res.status(200).json({ status: true, count });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: 'Không lấy được thông tin giỏ hàng' });
        }
    },

    decrementProductQuantity: async (req, res) => {
        try {
            const userId = req.user.id;
            const id = req.params.id;
            const cartItem = await Cart.findOne({ userId, _id: id });

            if (cartItem) {
                const productPrice = cartItem.totalPrice / cartItem.quantity;

                if (cartItem.quantity > 1) {
                    cartItem.quantity -= 1;
                    cartItem.totalPrice -= productPrice;
                    await cartItem.save();
                    return res.status(200).json({ status: true, count: await Cart.countDocuments({ userId }) });
                } else {
                    await Cart.findOneAndDelete({ userId, _id: id });
                    return res.status(200).json({ status: true, count: await Cart.countDocuments({ userId }) });
                }
            } else {
                return res.status(400).json({ status: false, message: "Giỏ hàng trống" });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
}