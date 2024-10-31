const Restaurant = require('../models/restaurant');

module.exports = {
    addRestaurant: async (req, res) => {
        const { title, time, imageUrl, owner, logoUrl, description } = req.body;

        if (!title || !time || !imageUrl || !owner || !logoUrl || !description
            || !description.latitude || !description.longitude || !description.address || !description.title) {
            return res.status(400).json({ status: false, message: 'Hãy điền thông tin vào tất cả các trường!' });
        }

        try {
            const newRestaurant = new Restaurant(req.body);
            await newRestaurant.save();
            res.status(201).json({ status: true, message: 'Nhà hàng đã được thêm' });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
    
    getRestaurantById: async (req, res) => {
        const id = req.params.id;
        try {
            const restaurant = await Restaurant.findById(id);
            if (!restaurant) {
                return res.status(404).json({ status: false, message: 'Nhà hàng không tồn tại' });
            }
            res.status(200).json( restaurant );
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
    
    getAllNearByRestaurants: async (req, res) => {
        try {
            const allNearByRestaurants = await Restaurant.find({ isAvailable: true }, { __v: 0 });
            res.status(200).json( allNearByRestaurants );
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
    
    getRandomRestaurants: async (req, res) => {
        try {
            const randomRestaurants = await Restaurant.aggregate([
                { $match: { isAvailable: true } },
                { $sample: { size: 5 } },
                { $project: { __v: 0 } }
            ]);
            res.status(200).json( randomRestaurants );
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
};