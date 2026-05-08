const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    contact: String,
    department: String,

    role: { type: String, default: "user" }
});

module.exports = mongoose.model("User", userSchema);