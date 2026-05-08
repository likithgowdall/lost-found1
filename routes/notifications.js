const express = require("express");
const router = express.Router();

const Notification =
require("../models/Notification");

/* AUTH */
function isAuth(req,res,next){

    if(!req.session.userId){
        return res.status(401).send("Unauthorized");
    }

    next();
}

/* GET NOTIFICATIONS */
router.get("/",
isAuth,

async(req,res)=>{

    const notes =
        await Notification.find({

            userId:req.session.userId

        }).sort({ createdAt:-1 });

    res.json(notes);
});

module.exports = router;