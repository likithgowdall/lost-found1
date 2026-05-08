const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Item = require("../models/Item");
const Claim = require("../models/Claim");

/* =========================
   ADMIN MIDDLEWARE
========================= */

function isAdmin(req,res,next){

    if(req.session.role !== "admin"){
        return res.status(403).send(
            "Access denied"
        );
    }

    next();
}

/* =========================
   DASHBOARD STATS
========================= */

router.get("/stats",
isAdmin,

async(req,res)=>{

    try{

        const users =
            await User.countDocuments();

        const items =
            await Item.countDocuments();

        const claims =
            await Claim.countDocuments();

        const lost =
            await Item.countDocuments({
                type:"lost"
            });

        const found =
            await Item.countDocuments({
                type:"found"
            });

        const claimed =
            await Item.countDocuments({
                status:"claimed"
            });

        res.json({
            users,
            items,
            claims,
            lost,
            found,
            claimed
        });

    }catch(err){

        res.send(err.message);
    }
});

/* =========================
   ALL USERS
========================= */

router.get("/users",
isAdmin,

async(req,res)=>{

    try{

        const users =
            await User.find()
            .sort({ createdAt:-1 });

        res.json(users);

    }catch(err){

        res.send(err.message);
    }
});

/* =========================
   ALL ITEMS
========================= */

router.get("/items",
isAdmin,

async(req,res)=>{

    try{

        const items =
            await Item.find()
            .sort({ createdAt:-1 });

        res.json(items);

    }catch(err){

        res.send(err.message);
    }
});

/* =========================
   ALL CLAIMS
========================= */

router.get("/claims",
isAdmin,

async(req,res)=>{

    try{

        const claims =
            await Claim.find()
            .sort({ createdAt:-1 });

        res.json(claims);

    }catch(err){

        res.send(err.message);
    }
});

/* =========================
   DELETE ITEM
========================= */

router.delete("/item/:id",
isAdmin,

async(req,res)=>{

    try{

        const item =
            await Item.findById(req.params.id);

        if(!item){
            return res.send(
                "Item not found"
            );
        }

        await Item.findByIdAndDelete(
            req.params.id
        );

        res.send(
            "🗑 Item deleted"
        );

    }catch(err){

        res.send(err.message);
    }
});

/* =========================
   DELETE USER
========================= */

router.delete("/user/:id",
isAdmin,

async(req,res)=>{

    try{

        const user =
            await User.findById(req.params.id);

        if(!user){
            return res.send(
                "User not found"
            );
        }

        await User.findByIdAndDelete(
            req.params.id
        );

        res.send(
            "🗑 User deleted"
        );

    }catch(err){

        res.send(err.message);
    }
});

/* =========================
   DELETE CLAIM
========================= */

router.delete("/claim/:id",
isAdmin,

async(req,res)=>{

    try{

        const claim =
            await Claim.findById(req.params.id);

        if(!claim){
            return res.send(
                "Claim not found"
            );
        }

        await Claim.findByIdAndDelete(
            req.params.id
        );

        res.send(
            "🗑 Claim deleted"
        );

    }catch(err){

        res.send(err.message);
    }
});

/* =========================
   CHANGE ITEM STATUS
========================= */

router.put("/status/:id",
isAdmin,

async(req,res)=>{

    try{

        const item =
            await Item.findById(req.params.id);

        if(!item){
            return res.send(
                "Item not found"
            );
        }

        item.status =
            req.body.status;

        await item.save();

        res.send(
            "✅ Status updated"
        );

    }catch(err){

        res.send(err.message);
    }
});

/* =========================
   URGENT ITEMS
========================= */

router.get("/urgent",
isAdmin,

async(req,res)=>{

    try{

        const items =
            await Item.find({
                priority:"urgent"
            });

        res.json(items);

    }catch(err){

        res.send(err.message);
    }
});

module.exports = router;