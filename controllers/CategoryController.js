const Category = require('../models/category');

module.exports = {
    createCategory: async (req, res) => {
        const newCategory = new Category( req.body );
        try {
            await newCategory.save();
            res.status(201).json({ 
                status: true, 
                message: 'Tạo Category thành công'
            });
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.find(
                { title: { $ne: 'Tất cả' }},
                { __v: 0 }
            );
            res.status(200).json( categories );
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    },

    getRandomCategories: async (req, res) => {
        try {
            const categories = await Category.aggregate([
                { $match: { value: { $ne: "all" } } },
                { $sample: { size: 4 } }
            ]);

            const moreCategory = await Category.findOne({ value: "all" }, { __v: 0 });

            if (moreCategory) {
                categories.push(moreCategory);
            }

            res.status(200).json( categories );
        } catch (error) {
            res.status(500).json({ status: false, message: error.message });
        }
    }
}