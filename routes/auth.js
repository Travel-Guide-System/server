const router = require("express").Router();
const jwt = require("jsonwebtoken");
const OTP = require("../models/otp");
const sms = require("../services/sms");
const User= require("../models/user");



router.post("/login", async (req, res) => {
	try {
		const { mobileNo } = req.body;
		const otp = Math.floor(100000 + Math.random() * 900000);
		sms.sendOTP(mobileNo, otp);
		const newOtp = new OTP({ mobileNo, otp });
		//Delete any past otp data with this number
		await OTP.deleteMany({ mobileNo });
		//Save new Otp in database
		await newOtp.save();
		res.status(200).json({ msg: "OTP sended Successfully", otp: otp });
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

router.post("/verifyOTP", async (req, res) => {
	try {
		const { mobileNo, otp } = req.body;
		const savedOtp = await OTP.findOne({ mobileNo });
		if (savedOtp.otp == otp) {

			savedOtp.verified=true
			updated=await savedOtp.save();
			// Token payload
			const payload = {
				mobileNo: mobileNo,
			};
			const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
			res.status(200).json({ msg: "Login Success", accessToken: accessToken });
		} else {
			res.status(403).json({ msg: "Incorrect OTP" });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
