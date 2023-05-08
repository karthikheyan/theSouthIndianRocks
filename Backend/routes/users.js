const express=require("express")
const routes=express.Router()
const Product=require('../models/product')
const Image=require("../models/image")
const ProductType=require("../models/type")
const Category=require("../models/category")
const multer = require("multer")
const fs=require("fs")
const { log } = require("console")
const User = require("../models/users")
const app=express()
const bcrypt=require("bcrypt")
const { json } = require("body-parser")




//create new user
routes.post("/signup",async(req,res)=>{
    try{
        const pwd=req.body.password;
        const hashedpwd=await bcrypt.hash(pwd,10);
        
        const { UserName,password,email,address,phone } = req.body;
        const duplicate=User.findOne({UserName:UserName})
if(!duplicate){
  const newUser = new User({
    UserName,
    email,
    password:hashedpwd,
    address,
    phone
  })
  newUser.save()
  .then(() => {
    res.send("Newuser is created")
  })
  .catch((err) => {
    //console.log(err, "error has occur");
    res.send(err.message)
  });
}
else{
  res.send("Try with another user name").status(401)
}
    }
    catch(err){
        //console.log(err)
        res.send(err.message)
    }

})




//user log in

routes.post("/login",async(req,res)=>{

try{
  const { email,password}=req.body;
  if(!email || !password){
    return res.status(400).json({ 'message': 'email and password are required.' })
  }

  const foundUser = await User.findOne({email:email})
   
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // create JWTs
        //localStorage.setItem("UserData",JSON.stringify(foundUser));
        res.send(foundUser);
    } else {
        res.status(401).send("Password wrong");
    }

}
catch(err){
console.log(err);
}
})




module.exports=routes