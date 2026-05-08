const express = require("express");
const router = express.Router();

const Claim = require("../models/Claim");
const Item = require("../models/Item");
const Notification =
require("../models/Notification");
const User = require("../models/User");

/* =========================
   AUTH
========================= */

function isAuth(req,res,next){

    if(!req.session.userId){
        return res.status(401).send("Unauthorized");
    }

    next();
}

/* =========================
   CREATE CLAIM
========================= */

router.post("/:itemId",
isAuth,

async(req,res)=>{

    try{

        const item = await Item.findById(
            req.params.itemId
        );

        if(!item){
            return res.send("Item not found");
        }

        /* prevent self claim */
        if(item.userId == req.session.userId){
            return res.send(
                "❌ You cannot claim your own item"
            );
        }

        /* prevent duplicate claim */
        const exists = await Claim.findOne({

            itemId:req.params.itemId,

            requesterId:req.session.userId
        });

        if(exists){
            return res.send(
                "⚠ Already requested"
            );
        }

        /* create claim */
        const claim = new Claim({

            itemId:req.params.itemId,

            requesterId:req.session.userId,

            status:"pending"
        });

        await claim.save();
       const requester = await User.findById(
    req.session.userId
);

await Notification.create({

    userId:item.userId,

    message:`📦 ${requester.name} requested your item: ${item.name}`
});

        /* increase claim count */
        item.claims += 1;

        await item.save();

        res.send(
            "✅ Claim request sent"
        );

    }catch(err){

        res.send(
            "Error: " + err.message
        );
    }
});

/* =========================
   GET MY CLAIMS
========================= */

router.get("/",
isAuth,

async(req,res)=>{

    try{

        /* my posted items */
        const myItems = await Item.find({
            userId:req.session.userId
        });

        const ids = myItems.map(
            i => i._id.toString()
        );

        const claims = await Claim.find({

            itemId:{
                $in:ids
            }

        }).sort({ createdAt:-1 });

        res.json(claims);

    }catch(err){

        res.send(err.message);
    }
});

/* =========================
   APPROVE / REJECT
========================= */

router.put("/:claimId",
isAuth,

async(req,res)=>{

    try{

        const claim = await Claim.findById(
            req.params.claimId
        );

        if(!claim){
            return res.send("Claim not found");
        }

        const item = await Item.findById(
            claim.itemId
        );

        if(!item){
            return res.send("Item not found");
        }

        /* only owner */
        if(item.userId != req.session.userId){

            return res.status(403).send(
                "Not allowed"
            );
        }

        const status = req.body.status;

        /* VALIDATION */
        if(
            status !== "approved" &&
            status !== "rejected"
        ){
            return res.send(
                "Invalid status"
            );
        }

        /* update claim */
        claim.status = status;

        await claim.save();

        /* if approved */
        if(status === "approved"){
            const owner = await User.findById(
    req.session.userId
);

await Notification.create({

    userId:claim.requesterId,

    message:`✅ ${owner.name} approved your claim for ${item.name}`
});

            item.status = "claimed";

            await item.save();

            /* reject other pending claims */
            await Claim.updateMany({

                itemId:claim.itemId,

                _id:{
                    $ne:claim._id
                }

            },{
                status:"rejected"
            });
        }

        /* if rejected */
        if(status === "rejected"){
           await Notification.create({

    userId:claim.requesterId,

    message:`❌ ${owner.name} rejected your claim for ${item.name}`
});

            item.status = "available";

            await item.save();
        }

        res.send(
            "✅ Claim updated"
        );

    }catch(err){

        res.send(
            "Error: " + err.message
        );
    }
});

/* =========================
   MY REQUESTED CLAIMS
========================= */

router.get("/myrequests",
isAuth,

async(req,res)=>{

    try{

        const claims = await Claim.find({

            requesterId:req.session.userId

        }).sort({ createdAt:-1 });

        res.json(claims);

    }catch(err){

        res.send(err.message);
    }
});

module.exports = router;