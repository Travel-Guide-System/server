const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Guide = require("../models/guide");
const OTP = require("../models/otp");
const sms = require("../services/sms");
const Service = require("../models/service");
const check_auth = require("../middleware/check-auth");
const User = require("../models/user");

router.post("/updateProfile", check_auth, async (req, res) => {
	const { name, mobileNo, dob, gender, longitude, latitude } = req.body;
	try {
		const otp = await OTP.findOne({ mobileNo });
		if (otp && otp.verified) {
			let savedGuide = await Guide.findOne({ mobileNo });
			if (savedGuide) {
				return res.status(403).send("Guide Exists");
			}

			let guide = new Guide({
				name,
				mobileNo,
				dob,
				gender,
				location: {
					type: "Point",
					coordinates: [parseFloat(longitude), parseFloat(latitude)],
				},
			});
			await guide.save();
			await OTP.deleteOne({ mobileNo });
			res.status(200).send("Guide Profile Saved");
		} else {
			res.status(401).send("Not Authorized");
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("Internal Server Error");
	}
});

router.post("/swithcActive", check_auth, async (req, res) => {
	try {
		const { active } = req.body;
		const currentGuide = await Guide.findOne({ mobileNo: req.user.mobileNo });
		currentGuide.active = active;
		await currentGuide.save();
		res.status(200).send(`You are currently ${active ? "" : "not "}active`);
	} catch (err) {
		console.log("Internal server error in switch Active", err);
		res.status(500).send("Please try after some time");
	}
});

router.post("/rating", check_auth, async (req, res) => {
	try {
		const { rating, serviceID } = req.body;
		const currentService = await Service.findOne({ _id: serviceID });
		if (!currentService) return res.status(404).send("No such service exists");
		if (currentService.guideRating==-1) {
			currentService.guideRating = parseFloat(rating);
			//update the user rating
			const currentUser = await User.findOne({ _id: currentService.user });
      let totalServices= (await Service.findAll({guide: currentService.guide})).length;

      let updatedRating=0;
      if(totalServices!=0)
         updatedRating= ((totalServices-1)*currentUser.rating + parseFloat(rating))/totalServices;
      currentUser.rating=updatedRating;
      
      await currentUser.save();
      await currentService.save();

			res.status(200).send("Rating submitted successfully");
		} else {
			res.status(200).send("You already rated the rider");
		}
	} catch (err) {
		console.log("Internal server error in guide rating", err);
		res.status(500).send("Please try after some time");
	}
});

router.get("/all", async (req, res) => {
	res.json(Guide.find({}));
});

module.exports = router;
