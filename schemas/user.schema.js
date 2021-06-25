const mongoose = require("mongoose");
const dbUtill = require("../dbUtill/utills");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255,
    },
    email: {
        type: String,
        required: true,
        max: 255,
        unique:true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    type:{
        type:String,
        required:true,
    }
},{timestamps:true});

module.exports = mongoose.model(dbUtill.USER, userSchema);
