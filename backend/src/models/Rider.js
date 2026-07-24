const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
    name: { type: String, required: true},
    currentLocation: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
    isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Rider' , riderSchema);