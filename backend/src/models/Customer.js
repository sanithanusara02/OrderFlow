const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true},
    savedAddress: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
}, { timestamps: true });

module.exports = mongoose.model('Customer' , customerSchema);