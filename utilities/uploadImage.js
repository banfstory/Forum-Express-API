
const uploadImage = (image_path) => {
    const multer = require('multer');
    const fs = require('fs');
    const crypto = require('crypto');

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, image_path);
        },
        filename: (req, file, cb) => {
            while(true) {
                const hex = crypto.randomBytes(64).toString('hex');
                path = hex + file.originalname;
                if(!fs.existsSync(image_path + path)) return cb(null, path); 
            }
        }
    });
    
    const fileFilter = (req, file, cb) => {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
    
    return multer({
        storage: storage,
        fileFilter: fileFilter
    });
}

module.exports = uploadImage;