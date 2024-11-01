const mongoose = require('mongoose');
const Food = require('../models/food');

module.exports = {
    addFood: async (req, res) => {
        const { title, foodTags, category, restaurant, description, time, price, additives, imageUrl } = req.body;

        if (!title || !foodTags || !category || !restaurant || !description || !time || !price || !additives || !imageUrl) {
            return res.status(400).json({ status: false, message: "Hãy điền thông tin vào tất cả các trường!" });
        }

        try {
            const newFood = new Food(req.body);
            await newFood.save();
            res.status(201).json({ 
                status: true, 
                message: 'Thêm món ăn thành công',
                food: newFood
            });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getFoodById: async (req, res) => {
        const id = req.params.id;

        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: false, message: 'ID không hợp lệ!' });
        }

        try {
            const food = await Food.findById(id);
            if (!food) {
                return res.status(404).json({ status: false, message: 'Món ăn không tồn tại!' });
            }
            res.status(200).json({ status: true, food });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getAllFood: async (req, res) => {
        try {
            const allFood = await Food.aggregate([
                { $match: { isAvailable: true } },
                { $project: { __v: 0 } }
            ]);
            if (allFood.length === 0) {
                return res.status(404).json({ status: false, message: 'Không có món ăn nào khả dụng' });
            }
            res.status(200).json( allFood );
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getAllFoodsSortedByTime: async (req, res) => {
        try {
            const allFood = await Food.aggregate([
                { $match: { isAvailable: true } },
                { 
                    $addFields: { 
                        timeAsNumber: { $toInt: "$time" } 
                    } 
                },
                { $sort: { timeAsNumber: 1 } }, 
                { $project: { __v: 0, timeAsNumber: 0 } } 
            ]);
            if (allFood.length === 0) {
                return res.status(404).json({ status: false, message: 'Không có món ăn nào khả dụng' });
            }
            res.status(200).json(allFood);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
    

    getRandomFood: async (req, res) => {
        try {
            const randomFood = await Food.aggregate([
                { $match: { isAvailable: true } },
                { $project: { __v: 0 } }
            ]);
            if (randomFood.length === 0) {
                return res.status(404).json({ status: false, message: 'Không có món ăn nào khả dụng' });
            }
            res.status(200).json( randomFood );
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getFoodByRestaurant: async (req, res) => {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ status: false, message: 'ID không hợp lệ!' });
        }

        try {
            const foods = await Food.find({ restaurant: id, isAvailable: true }).lean();
            if (foods.length === 0) {
                return res.status(404).json({ status: false, message: 'Không có món ăn nào khả dụng cho nhà hàng này' });
            }
            res.status(200).json( foods );
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getFoodByCategory: async (req, res) => {
        const { category, code } = req.params;
        try {
            const foods = await Food.aggregate([
                { $match: { category: category, isAvailable: true } },
                { $project: { __v: 0 } }
            ]);
            if (foods.length === 0) {
                return res.status(200).json([]);
            }

            res.status(200).json(foods);
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
    

    searchFood: async (req, res) => {
        const search = req.params.search;
        try {
            const result = await Food.aggregate([{ 
                $search: {
                    index: "foods",
                    text: {
                        query: search,
                        path: {
                            wildcard: "*"
                        }
                    }
                }
            }]);
            if (result.length === 0) {
                return res.status(404).json({ status: false, message: 'Không tìm thấy món ăn nào phù hợp' });
            }
            res.status(200).json( result );
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getRandomFoodByCategory: async (req, res) => {
        const category = req.params.category;
        try {
            const randomFood = await Food.aggregate([
                { $match: { category: category, isAvailable: true } },
                { $sample: { size: 10 } },
                { $project: { __v: 0 } }
            ]);
            if (randomFood.length === 0) {
                return res.status(404).json({ status: false, message: 'Không có món ăn nào khả dụng trong danh mục này' });
            }
            res.status(200).json({ status: true, foods: randomFood });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },
};
