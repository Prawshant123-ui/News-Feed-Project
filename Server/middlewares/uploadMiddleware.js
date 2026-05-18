const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "news_uploads",
        allowed_formats:  ["jpg", "png", "jpeg", "webp", "mp4", "mov", "webm"]
    }
});

const upload = multer({ storage });

module.exports = upload;