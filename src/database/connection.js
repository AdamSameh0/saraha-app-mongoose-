import mongoose from "mongoose";
import { uri } from "../../config/index.js";
export const connection = async ()=>{
  await mongoose.connect(uri).then(()=>{
    console.log("database is connected");
  }).catch((err)=>{
    console.log(err);
  })
}