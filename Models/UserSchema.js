import mongoose from "mongoose";
const userschema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        maxlength:32,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    }
})
const User = mongoose.model("User",userschema)
export default User;