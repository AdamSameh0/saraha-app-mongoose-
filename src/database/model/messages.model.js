

import mongoose from "mongoose"


const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        min: 10,
        max: 500,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    date: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String
    }
},
    { timestamps: true })


export const messagesModel = mongoose.model("messages", messageSchema)