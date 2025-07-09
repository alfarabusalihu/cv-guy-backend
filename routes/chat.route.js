const express=require('express')
const {askCV}=require("../controllers/chat.controller")

const router=express.Router()

router.post("/",askCV)

module.exports=router