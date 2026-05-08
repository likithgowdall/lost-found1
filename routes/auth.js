const express = require("express");
const router = express.Router();

const User = require("../models/User");

const bcrypt = require("bcrypt");

/* =========================
   REGISTER
========================= */

router.post("/register",

async(req,res)=>{

    try{

        /* check username exists */
        const exists = await User.findOne({
            username:req.body.username
        });

        if(exists){
            return res.send(
                "⚠ Username already exists"
            );
        }

        /* hash password */
        const hashedPassword =
            await bcrypt.hash(
                req.body.password,
                10
            );

        /* create user */
        const user = new User({

            name:req.body.name,

            username:req.body.username,

            password:hashedPassword,

            contact:req.body.contact,

            department:req.body.department,

            role:req.body.role || "user"
        });

        await user.save();

        res.send(
            "✅ User Registered"
        );

    }catch(err){

        res.status(400).send(
            "Error: " + err.message
        );
    }
});

/* =========================
   LOGIN
========================= */

router.post("/login",

async(req,res)=>{

    try{

        const user = await User.findOne({

            username:req.body.username

        });

        if(!user){

            return res.status(404).send(
                "❌ User not found"
            );
        }

        const valid =
            await bcrypt.compare(
                req.body.password,
                user.password
            );

        if(!valid){

            return res.status(401).send(
                "❌ Invalid password"
            );
        }

        /* SESSION */
        req.session.userId = user._id;

        req.session.role = user.role;

        req.session.username = user.username;

        res.send(
            "✅ Login Successful"
        );

    }catch(err){

        res.send(
            err.message
        );
    }
});

/* =========================
   CURRENT USER
========================= */

router.get("/me",

async(req,res)=>{

    try{

        if(!req.session.userId){

            return res.status(401).send(
                "Not logged in"
            );
        }

        const user = await User.findById(
            req.session.userId
        );

        if(!user){

            return res.send(
                "User not found"
            );
        }

        res.json({

            id:user._id,

            name:user.name,

            username:user.username,

            contact:user.contact,

            department:user.department,

            role:user.role
        });

    }catch(err){

        res.send(err.message);
    }
});

/* =========================
   LOGOUT
========================= */

router.get("/logout",

(req,res)=>{

    req.session.destroy(err=>{

        if(err){
            return res.send(
                "Logout error"
            );
        }

        res.send(
            "✅ Logged out"
        );
    });
});

/* =========================
   PROFILE UPDATE
========================= */

router.put("/profile",

async(req,res)=>{

    try{

        if(!req.session.userId){

            return res.status(401).send(
                "Unauthorized"
            );
        }

        const user = await User.findById(
            req.session.userId
        );

        if(!user){

            return res.send(
                "User not found"
            );
        }

        user.name =
            req.body.name || user.name;

        user.contact =
            req.body.contact || user.contact;

        user.department =
            req.body.department || user.department;

        await user.save();

        res.send(
            "✅ Profile Updated"
        );

    }catch(err){

        res.send(err.message);
    }
});

module.exports = router;