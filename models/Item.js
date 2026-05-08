const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({

    /* OWNER */
    userId:{
        type:String,
        required:true
    },

    /* BASIC INFO */
    name:{
        type:String,
        required:true
    },

    description:{
        type:String,
        default:""
    },

    location:{
        type:String,
        default:""
    },

    /* CATEGORY */
    category:{
        type:String,
        default:"Others"
    },

    /* IMAGE */
    image:{
        type:String,
        default:""
    },

    /* LOST / FOUND */
    type:{
        type:String,
        enum:["lost","found"],
        required:true
    },

    /* STATUS */
    status:{
        type:String,
        enum:[
            "available",
            "claimed",
            "returned"
        ],
        default:"available"
    },

    /* PRIORITY */
    priority:{
        type:String,
        enum:[
            "normal",
            "urgent"
        ],
        default:"normal"
    },

    /* CLAIM COUNT */
    claims:{
        type:Number,
        default:0
    }

},
{
    timestamps:true
});

module.exports =
mongoose.model("Item", itemSchema);