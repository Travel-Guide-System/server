const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Guide = require("../models/guide");
const OTP = require("../models/otp");
const sms = require("../services/sms");
const check_auth = require("../middleware/check-auth");

router.get("/", async (req, res) => {
	res.status(200).json({ success: "Welcome to TravelGuide" });
});

router.post("/updateProfile", async (req, res) => {
	const { name, mobileNo, dob, gender } = req.body;
	console.log(req.body);
	try {
		console.log(mobileNo);
		const otp = await OTP.findOne({ mobileNo });
		console.log(otp);
		if (otp && otp.verified) {
			let savedUser = await User.findOne({ mobileNo });
			if (savedUser) {
				return res.status(403).send("User Exists");
			}

			let user = new User({ name, mobileNo, dob, gender });
			await user.save();
			await OTP.deleteOne({ mobileNo });
			res.status(200).send("Profile Saved");
		} else {
			res.status(401).send("Not Authorized");
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("Internal Server Error");
	}
});

router.post("/updateLocation", check_auth, async (req, res) => {
	try {
		const { latitude, longitude } = req.body;
		const user = await User.findOne({ mobileNo: req.user.mobileNo });
		user.location = {
			type: "Point",
			coordinates: [parseFloat(longitude), parseFloat(latitude)],
		};
		await user.save();
		res.status(200).send("Location Updated");
	} catch (err) {
		console.log(err);
		res.status(500).send("Internal Server Error");
	}
});

router.post("/searchGuides", check_auth, async (req, res) => {
	try {
		const { latitude, longitude } = req.body;
		console.log(latitude, longitude);
		let maxDistance = 10000; //10 km
		let data = await Guide.aggregate([
			{
				$geoNear: {
					near: {
						type: "Point",
						coordinates: [parseFloat(longitude), parseFloat(latitude)],
					},
					maxDistance: maxDistance,
					spherical: true,
					distanceField: "distance",
					query: { active: true }, //Only take active users
				},
			},
		]);

    res.status(200).json(data);
	} catch (err) {
		console.log(err);
		res.status(500).send("Internal Server Error");
	}
});

router.post('/rating', check_auth, async (req, res) => {
	try{
	  const { rating, serviceID } = req.body;
	  const currentService = await Service.findOne({_id: serviceID});
	  if(!currentService) return res.status(404).send("No such service exists");
	  if(isNaN(currentService.userRating)) {
		currentService.userRating = parseFloat(rating);
		//update the user rating
		const currentGuide = await Guide.findOne({_id: currentService.guide});
		let currentGuideUpdatedRating =  (currentGuide.rating + parseFloat(rating))/2;
		currentGuideUpdatedRating = parseFloat(currentGuideUpdatedRating.toFixed(2));
		await  currentGuideUpdatedRating.save();
		res.status(200).send("Rating submitted successfully");
	  } else {
		res.status(200).send("You already rated the rider");
	  }
	} catch(err) {
	  console.log('Internal server error in guide rating', err);
	  res.status(500).send("Please try after some time");
	}
});

module.exports = router;
