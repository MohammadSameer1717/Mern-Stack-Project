import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:["student","educator"],
        required:true
    },
    photoUrl:{
        type:String,
        default:""
    },
    enrolledCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }]

}, {timestamps:true})

const user = mongoose.model("User" , userSchema)

export default(user);