const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema({
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

    rating:{
        type:Number,
        default:5.0,
    },
	active:{
		type:Boolean,
		default:false
	}
});

module.exports = mongoose.model("Guide", guideSchema);
