const express=require("express")
const routes=express.Router()
const Product=require('../models/product')
const Image=require("../models/image")
const ProductType=require("../models/type")
const Category=require("../models/category")
const Gallery=require("../models/gallery")
const multer = require("multer")
const fs=require("fs")
const { log } = require("console")
const User = require("../models/users")
const app=express()
const bcrypt=require("bcrypt")
const { json } = require("body-parser")



//post images for gallery
const image_storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/gallery_images");
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
  });
  
  const upload_image= multer({
    storage: image_storage,
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
      const allowedExtensions = [".png", ".jpeg", ".jpg", ".gif"];
  
      if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(path.extname(file.originalname).toLowerCase())) {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Allowed only .png, .jpg, .jpeg, and .gif'));
      }
    }
  });
    
    routes.post("/category", upload_image.single("categoryImage"), (req, res) => {
      const url = req.protocol + '://' + req.get('host')
      const saveImage =  Gallery({
       
        image: url + '/uploads/gallery_images/' + req.file.filename,
        
      });
      saveImage
        .save()
        .then((res) => {
          console.log("category image is saved");
        })
        .catch((err) => {
          console.log(err, "error has occur");
        });
        res.send('category image is saved')
    });
  


//get images from gallery
routes.get("/gallery/image",async(req,res)=>{
    try{
        const images=await Gallery.find()
        res.status(200).send(images)
    }
    catch{
        console.log(err)
        res.status(404).send(err)
    }
})