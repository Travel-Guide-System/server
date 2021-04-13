const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const OTP = require("../models/otp");
const sms = require("../services/sms");


router.get("/", async (req, res) => {
  res.status(200).json({success:"Welcome to TravelGuide"})
});

module.exports = router;
