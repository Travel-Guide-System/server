const router = require("express").Router();
const jwt=require("jsonwebtoken");
const User=require("../models/user");
const Otp=require("../models/otp");


router.post("/login", async (req, res) => {
  const {name,mobileNo}=req.body;
  const user={
    name:name,
  }
  const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
  res.status(200).json({accessToken:accessToken,msg:"Sucess"});

  
});

module.exports = router;
