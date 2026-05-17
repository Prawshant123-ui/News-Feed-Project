const express = require("express");

const { createNews,getAllNews,getSingleNews,searchNews,getNewsByCategory,updateNews,deleteNews} = require("../controllers/newsController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const Router = express.Router();

Router.post(
    "/",
    protect,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "video", maxCount: 1 }
    ]),
    createNews
);
Router.get("/",getAllNews);
Router.get("/search",searchNews)
Router.get("/category/:category", getNewsByCategory);
Router.get("/:id",getSingleNews)
Router.put("/:id",protect, updateNews);
Router.delete("/:id",protect, deleteNews);



module.exports = Router;