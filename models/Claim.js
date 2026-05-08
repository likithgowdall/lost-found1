const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({

    /* ITEM */
    itemId:{
        type:String,
        required:true
    },

    /* USER REQUESTING CLAIM */
    requesterId:{
        type:String,
        required:true
    },

    /* CLAIM STATUS */
    status:{
        type:String,

        enum:[
            "pending",
            "approved",
            "rejected"
        ],

        default:"pending"
    },

    /* VERIFICATION MESSAGE */
    message:{
        type:String,
        default:""
    },

    /* OWNER RESPONSE */
    response:{
        type:String,
        default:""
    }

},
{
    timestamps:true
});

module.exports =
mongoose.model("Claim", claimSchema);