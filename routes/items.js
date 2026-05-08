const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const multer = require("multer");

/* =========================
   AUTH MIDDLEWARE
========================= */

function isAuth(req, res, next){

    if(!req.session.userId){
        return res.status(401).send("Unauthorized");
    }

    next();
}

/* =========================
   MULTER
========================= */

const storage = multer.diskStorage({

    destination:"uploads/",

    filename:(req,file,cb)=>{
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

/* =========================
   POST ITEM
========================= */

router.post("/",
isAuth,
upload.single("image"),

async(req,res)=>{

    try{

        const item = new Item({

            userId:req.session.userId,

            name:req.body.name,

            description:req.body.description,

            location:req.body.location,

            category:req.body.category || "Others",

            type:req.body.type,

            image:req.file ? req.file.filename : "",

            status:"available"
        });

        await item.save();

        res.send("✅ Item Posted");

    }catch(err){

        res.status(400).send(
            "Error: " + err.message
        );
    }
});

/* =========================
   GET ITEMS
========================= */

router.get("/", async(req,res)=>{

    const search = req.query.search || "";

    const items = await Item.find({

        $or:[
            {
                name:{
                    $regex:search,
                    $options:"i"
                }
            },
            {
                category:{
                    $regex:search,
                    $options:"i"
                }
            },
            {
                location:{
                    $regex:search,
                    $options:"i"
                }
            }
        ]

    }).sort({ createdAt:-1 });

    res.json(items);
});

/* =========================
   MY ITEMS
========================= */

router.get("/my", isAuth, async(req,res)=>{

    const items = await Item.find({
        userId:req.session.userId
    }).sort({ createdAt:-1 });

    res.json(items);
});

/* =========================
   UPDATE ITEM
========================= */

router.put("/:id",
isAuth,

async(req,res)=>{

    try{

        const item = await Item.findById(req.params.id);

        if(!item){
            return res.send("Item not found");
        }

        if(item.userId != req.session.userId){
            return res.status(403).send("Not allowed");
        }

        item.name =
            req.body.name || item.name;

        item.description =
            req.body.description || item.description;

        item.location =
            req.body.location || item.location;

        item.category =
            req.body.category || item.category;

        await item.save();

        res.send("✅ Item Updated");

    }catch(err){

        res.send(
            "Error: " + err.message
        );
    }
});

/* =========================
   DELETE ITEM
========================= */

router.delete("/:id",
isAuth,

async(req,res)=>{

    try{

        const item = await Item.findById(
            req.params.id
        );

        if(!item){
            return res.send("Item not found");
        }

        if(item.userId != req.session.userId){
            return res.status(403).send(
                "Not allowed"
            );
        }

        await Item.findByIdAndDelete(
            req.params.id
        );

        res.send("🗑 Item Deleted");

    }catch(err){

        res.send(
            "Error: " + err.message
        );
    }
});

/* =========================
   CHANGE STATUS
========================= */

router.put("/status/:id",
isAuth,

async(req,res)=>{

    try{

        const item = await Item.findById(
            req.params.id
        );

        if(!item){
            return res.send("Item not found");
        }

        item.status = req.body.status;

        await item.save();

        res.send("Status Updated");

    }catch(err){

        res.send(err.message);
    }
});

/* =========================
   SMART MATCH (ADVANCED)
========================= */

router.get("/match/:keyword",

async(req,res)=>{

    const keyword = req.params.keyword;

    const matches = await Item.find({

        name:{
            $regex:keyword,
            $options:"i"
        }

    });

    res.json(matches);
});

module.exports = router;