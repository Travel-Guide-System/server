const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Guide = require("../models/guide");
const OTP = require("../models/otp");
const Service = require("../models/service.js");
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

// User will rate Guide
router.post("/rating", check_auth, async (req, res) => {
	try {
		const { rating, serviceID } = req.body;
		const currentService = await Service.findOne({ _id: serviceID });
		if (!currentService) return res.status(404).send("No such service exists");
		if (currentService.userRating == -1) {
			//Setting userRating in services
			currentService.userRating = parseFloat(rating);

			//Finding all the sevices done by the guide in which he was rated by user
			let totalServices = (
				await Service.find({
					guide: currentService.guide,
					userRating: { $gt: -1 },
				})
			).length;

			//update the guide rating
			const currentGuide = await Guide.findOne({ _id: currentService.guide });
			let updatedRating =
				(totalServices * currentGuide.rating + parseFloat(rating)) /
				(totalServices + 1);
			updatedRating.toPrecision(2);
			currentGuide.rating = updatedRating;
			//Saving
			await currentService.save();
			await currentGuide.save();
			res.status(200).send("Rating submitted successfully");
		} else {
			res.status(200).send("You already rated the guide");
		}
	} catch (err) {
		console.log("Internal server error in guide rating", err);
		res.status(500).send("Please try after some time");
	}
});


router.post("/newService",check_auth,async (req,res)=>{
	const {latitude,longitute,guide} = req.body();
	const service=new Service({latitude,longitude,guide});
	await service.save();
	//Send Message to Specific Guide
	
});	

module.exports = router;
