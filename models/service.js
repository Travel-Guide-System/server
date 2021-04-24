const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    guide: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    userRating: {
        type: Number, //rating the user gave to the guide
        default: NaN,
    },
    guideRating: {
        type: Number, //rating the guide gave to the user
        default: NaN,
    },
});

const model = mongoose.model('Service', schema);

module.exports = model;