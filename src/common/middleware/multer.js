import multer from "multer"

import fs from "fs"

export let extentions = {
    image : ["image/jpeg" , "image/png" , "image/jpg" , "image/webp"],
    video : ["video/mp4", "video/webcam" , "video/oog"],
    pdf : ["application/pdf"]
}

export const multer_local = ({ customPath , maxSize , allowedExtentions} = { customPath: "genral" , maxSize : 5}) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            let filesPath = `uploads/${customPath}`
            if (! fs.existsSync(filesPath)) {
                fs.mkdirSync(filesPath, { recursive: true })
            }
            cb(null, filesPath)
        },
        filename: function (req, file, cb) {
            let prefix = Date.now()
            let fileName = `${prefix}-${file.originalname}`
            cb(null, fileName)
        }
    })

    let fileFilter = function(req,file , cb){
     if(!allowedExtentions.includes(file.mimetype)){
        cb("file type is not allowed", false)
     }
     cb(null , true)
    }

    return multer({ storage , fileFilter, limits :{ fileSize : maxSize * 1024 * 1024}})
}