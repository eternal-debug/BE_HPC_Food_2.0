const Rating = require('../models/rating'); 
const Restaurant = require('../models/restaurant');
const Food = require('../models/food');

module.exports = {
    addRating: async (req, res) => {
        const newRating = new Rating({
            userId: req.user.id,
            ratingType: req.body.ratingType, 
            product: req.body.product,
            rating: req.body.rating
        });
        
        try {
            await newRating.save(); 

            
            if (req.body.ratingType === 'Nhà hàng') {
                const restaurants = await Rating.aggregate([
                    { $match: { ratingType: req.body.ratingType, product: req.body.product } },
                    { $group: { _id: '$product', averageRating: { $avg: '$rating' } } } 
                ]);

                if (restaurants.length > 0) {
                    const averageRating = restaurants[0].averageRating;
                    await Restaurant.findByIdAndUpdate(req.body.product, { rating: averageRating });
                }
            } 
            
            else if (req.body.ratingType === 'Đồ ăn') {
                const foods = await Rating.aggregate([
                    { $match: { ratingType: req.body.ratingType, product: req.body.product } },
                    { $group: { _id: '$product', averageRating: { $avg: '$rating' } } } 
                ]);

                if (foods.length > 0) {
                    const averageRating = foods[0].averageRating;
                    await Food.findByIdAndUpdate(req.body.product, { rating: averageRating });
                }
            }

            
            res.status(201).json({ status: true, message: 'Đánh giá thành công' });

        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    checkUserRating: async (req, res) => {
        const ratingType = req.query.ratingType;
        const product = req.query.product;

        try {
            const existingRating = await Rating.findOne({
                userId: req.user.id,
                product: product,
                ratingType: ratingType
            });

            if (existingRating) {
                res.status(200).json({ status: true, message: 'Bạn đã đánh giá trước đó' });
            } else {
                res.status(200).json({ status: false, message: 'Chưa đánh giá' });
            }
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
};
