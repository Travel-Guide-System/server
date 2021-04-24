const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    mobileNo: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    verified:{
        type:Boolean,
        default:false,
        requied:true,
    }
});

schema.index({createdAt: 1}, {expireAfterSeconds: 120}); //The otp fails to work after 30 seconds

const model = mongoose.model('OTP', schema);

module.exports = model;