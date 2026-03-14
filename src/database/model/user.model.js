import mongoose from "mongoose";
import { genderEnums, providerEnnums, roleEnum } from "../../common/enums/enum.service.js";
let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 15
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 15
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone:{
     type:String,
     default : "no phone number attatched"
    } ,
    age:{
        type:Number,
        default:18
    },
    gender: {
        type: String,
        enum: Object.values(genderEnums),
        default: genderEnums.Male
    },
    providers: {
        type: String,
        enum: Object.values(providerEnnums),
        default: providerEnnums.System
    },
    role: {
        type: String,
        enum: Object.values(roleEnum),
        default: roleEnum.user
    },
    viewCount: {
        type: Number,
        default: 0
    },
    sharedProfileName:{
        type:String,
        required: true,
        unique:true
    }, 
    image:{
        type:String,
        default: "uploads/default/default.jpg"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    bannedFromLogIn:{
    type:Number,
    default:0
    },
    twoFa:{
      type:Boolean,
      default:false
    }
},
    { timestamps: true })

userSchema.virtual("fullName").set(function (value) {
    let [firstName, lastName] = value.split(' ')
    this.firstName = firstName
    this.lastName = lastName
}).get(function () {
    return `${this.firstName}${this.lastName}`
})

export const userModel = mongoose.model("users", userSchema)