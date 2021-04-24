const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Guide = require("../models/guide");
const OTP = require("../models/otp");
const sms = require("../services/sms");
const check_auth= require("../middleware/check-auth");


router.post("/updateProfile", async (req,res)=>{
    const {name,mobileNo,dob,gender}=req.body;
    try{
      const otp= await OTP.findOne({mobileNo});
      if(otp && otp.verified){
        let savedGuide=await Guide.findOne({mobileNo});
        if (savedGuide){
          return res.status(403).send("Guide Exists");
        }

        let guide=new Guide({name,mobileNo,dob,gender});
        await guide.save();
        await OTP.deleteOne({mobileNo});
        res.status(200).send("Guide Profile Saved");
      }else{
        res.status(401).send("Not Authorized");
      }
    }
    catch(err){
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
});

router.get("/all",async (req,res)=>{
  res.json(Guide.find({}));
})

module.exports = router;
