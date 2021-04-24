const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name:{
        type:String ,
        required: true,
		default:"Shinchan",
    },
	mobileNo: {
		type: String,
		unique: true,
		required:true,
	},
	dob:{
		type:String,
		default: "Date Of birthday",
		required:true,
	},
	gender:{
		type:String,
		enum:["M","F","O"],
		default:"O",
		required:true,
	},
	rating: {
		type: Number,
		default: 5.0,
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
});

module.exports = mongoose.model("User", userSchema);
