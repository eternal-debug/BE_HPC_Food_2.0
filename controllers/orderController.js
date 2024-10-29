const Order = require('../models/order');

module.exports = {
    placeOrder: async (req, res) => {
        try {
            const newOrder = new Order({
                ...req.body,
                userId: req.user.id
            });
            await newOrder.save();
            const orderId = newOrder._id;
            res.status(201).json({status: true, message: "Đặt món thành công", orderId: orderId});
        } catch (error) {
            res.status(500).json({status: false, message:error.message});
        }
    },

    getUserOrder: async (req, res) => {
        const userId = req.user.id;
        const { paymentStatus, orderStatus } = req.query;
        let query = { userId };
        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }
        if (orderStatus) {
            query.orderStatus = orderStatus;
        }
        try {
            const orders = await Order.find(query)
                .populate({
                    path: 'orderItems.foodId',
                    select: "imageUrl title rating time"
                })
                .sort({ createdAt: -1 });
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
}