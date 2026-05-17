const News=require("../models/newsModel")



//Create News (CREATE Operation in CRUD )
// const createNews = async(req,res)=>{
//     try {
//         const {title,content,category,author}=req.body;

//         const news= await News.create({
//             title,
//             content,
//             category,
//             author
//         })
//         res.status(201).json(news);
        
//     } catch (error) {
//         res.status(500).json({message:error.message})
//     }
// }

//Create news with image/video  upload
const createNews = async (req, res) => {
    try {

        const { title, content, category, author } = req.body;

        const image = req.files?.image
            ? req.files.image[0].path
            : "";

        const video = req.files?.video
            ? req.files.video[0].path
            : "";

        const news = await News.create({
            title,
            content,
            category,
            author,
            image,
            video
        });

        res.status(201).json(news);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Read news (READ Operation in CRUD )

//Read all news

// const getAllNews = async(req,res)=>{
//     try {
//         const news = await News.find().sort({
//             createdAt :-1
//         })
//         res.status(201).json(news)
//     } catch (error) {
//         res.status(500).json({message:error.message})
//     }
// }



//Read all news with Pagination

const getAllNews = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const totalNews = await News.countDocuments();

        const news = await News.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalNews / limit),
            totalNews,
            news
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//Read single news (Dynamic routing having dynamic ID)

const getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: "News not found!" });
    }

    return res.status(200).json(news);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Searching news 

const searchNews=async(req,res)=>{
    try {
        const keyword = req.query.q

        const news=await News.find({
            title:{
                $regex:keyword,
                $options:"i"
            }
        })
        res.status(201).json(news)

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

//Category filtering

const getNewsByCategory=async(req,res)=>{
    try {
        const news=await News.find({
            category:req.params.category
        })
        res.status(201).json(news)
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


// Update news (UPDATE operation  in CRUD)

const updateNews=async(req,res)=>{
    try {
        const {title,content,category,author}=req.body

 const news=await News.findById(req.params.id)

 if(!news){
    res.status(500).json({
        message:"News not found !!"
    })
 }

 news.title=title || news.title
 news.content=content || news.content 
news.category=category || news.category
news.author=author || news.author

const updatedNews=await news.save()

res.status(200).json(updatedNews)
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


//Delete News (DELETE Operation in CRUD)

const deleteNews=async(req,res)=>{
    try {
        const news=await News.findById(req.params.id)

        if(!news){
    res.status(500).json({
        message:"News not found !!"
    })
 }
 await news.deleteOne()

    res.status(200).json({
            message: "News deleted successfully"
        });
    } catch (error) {
         res.status(500).json({
            message: error.message
        });
    }
}

module.exports= {createNews,getAllNews,getSingleNews,searchNews,getNewsByCategory,updateNews,deleteNews}