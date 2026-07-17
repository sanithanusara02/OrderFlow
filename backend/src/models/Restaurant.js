const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true},
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    isOpen: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant' , restaurantSchema);