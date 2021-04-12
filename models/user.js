const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name:{
        type:String ,
        required: true,
    },
	mobileNo: {
		type: String,
		unique: true,
	},
	verified: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("User", userSchema);
