const multer = require('multer');
const path = require('path');
let mimeType = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const imageUpload = multer({
    limits:500000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'upload/images')
        },
        filename: (req, file, cb) => {
            const ext = mimeType[file.mimetype]
            cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
        }
    }),
    fileFilter:(req, file, cb) => {
        const isValid = !!mimeType[file.mimetype]  //check if the valid mime type is submitted
        let error = isValid ? null : new Error('Invalid mime type');
        cb(error, isValid);
    }
});


module.exports =  imageUpload; 