import { Router } from "express";
import { auth, extentions, multer_local, SuccessResponse, validation } from "../../common/index.js";
import { deleteProfile, getUserBySharedProfileLink, logOut, shareProfileLink, updateProfile, userProfile } from "./index.js";
import { getUserByLinkSchema, updateProfileSchema } from "./users.validation.js";

export const userRouter = Router()



userRouter.get("/get-user-profile",auth,async(req,res)=>{
    let data = await userProfile(req.userId)
    SuccessResponse({res , message:"user found", status:302 , data})
})

userRouter.get("/shared-profile-link",auth,async(req,res)=>{
    let data = await shareProfileLink(req.userId)
    SuccessResponse({res,message:"done",status:200 , data})
})


userRouter.get("/get-user-by-sharedProfileUrl",validation(getUserByLinkSchema),async(req,res)=>{
   let data = await getUserBySharedProfileLink(req.body)
   SuccessResponse({res,message:"done",status:302,data})
})

userRouter.put("/update-user-profile",auth,validation(updateProfileSchema),multer_local({
    customPath:"Pfp",
    maxSize: 3,
    allowedExtentions:extentions.image
}).single("Pfp"),(req,res)=>{
 let updatedUser = updateProfile(req.userId,req.body,req.file)
 SuccessResponse({res,message:"updated successfully",status:200,data: updatedUser})
})

userRouter.delete("/delete-profile",auth,async(req,res)=>{
let deletedUser = await deleteProfile(req.userId)
SuccessResponse({res,message:"deleted successfully",status:200,data:deletedUser})
})

userRouter.post("/logOut",auth,(req,res)=>{
    let loggedOut = logOut(req)
    SuccessResponse({res,status:200,message:"logged out successfully and token revoked successfully"})
})