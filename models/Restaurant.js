const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    title: { type: String, required: true },
    time: { type: String, required: true },
    imageUrl: { type: String, required: true },
    food: { type: Array, default: [] },
    pickUp: { type: Boolean, default: true },
    delivery: { type: Boolean, default: true },
    isAvailable: { type: Boolean, default: true },
    owner: { type: String, required: true },
    logoUrl: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    ratingCount: { type: String, default: "409" },
    verification: { type: String, default: "Đang chờ", enum: ["Đang chờ", "Đã xác minh", "Bị từ chối"] },
    verificationMessage: { type: String, default: "Nhà hàng đang được xét duyệt, xin vui lòng đợi.", },
    description: { 
        id: { type: String },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        latitudeDelta: {  type: Number, default: 0.0122 },
        longitudeDelta: {  type: Number, default: 0.0122 },
        address: { type: String, required: true },
        title: { type: String, required: true }
    },
})

module.exports = mongoose.model('Restaurant', RestaurantSchema);