import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import validator from "validator";

const schema = new mongoose.Schema({

    name:String,
    email:{
        type : String,
        required:[true,"email required"],
        validate: [validator.isEmail,"InValid Email"],
        unique:true
    },
    username: {
        type: String,
        required: [true,"username required"],
        unique:true
    },
    password:{
        type: String,
        required:[true,"password required"],
        minLength:[4,"enter minimum 4 length password"],
        select: false
    
    },
    photo:String,
    googleId:{
        type:String,
        unique:true,
    },
    role:{
        type:"String",
        enum:["admin","user"],
        default:"user",
    },
    createdAt:{
        type:Date,
        default:new Date(Date.now()),
    }
});

schema.pre("save", async function(next){
    if(!this.isModified("password")) next()
    else this.password = await bcrypt.hash(this.password,12);
})

schema.methods.generateToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
}

schema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password)
}


export const User = mongoose.model("User",schema)