const postsRouter = require('express').Router();
const postsModel = require("./posts-model");

const validatePost=(req,res,next)=>{
    const {text} = req.body;
    if(text){
        next();
    }
    else{
        res.status(400).json({ message: "missing required text field" });
    }
};
const validatePostId=async(req,res,next)=>{
    try{
        const post = await postsModel.getById(req.params.id);
        if(post){
            next();
        }
        else{
            res.status(404).json({message: "post not found"});
        }
    }   
    catch(err){
        next();
    }
};


postsRouter.use("/posts",(req,res,next)=>{
    next();
});

postsRouter.get("/",async(req,res,next)=>{
    try{
        const posts = await postsModel.get();
        res.status(200).json(posts);
    }
    catch(err){
        next();
    }
});
postsRouter.post("/",validatePost,async(req,res,next)=>{
    try{
        const newPost = await postsModel.insert(req.body);
        res.status(201).json(newPost);
    }
    catch(err){
        next();
    }
})
postsRouter.get("/:id",validatePostId,async(req,res,next)=>{
    try{
        const post = await postsModel.getById(req.params.id);
        res.status(200).json(post);
    }
    catch(err){
        next();
    }
});

postsRouter.put("/:id",validatePostId,validatePost,async(req,res,next)=>{
    try{
        const post = await postsModel.update(req.params.id,req.body);
        res.status(200).json(post);
    }
    catch(err){
        next();
    }
});

postsRouter.delete("/:id",validatePostId,async(req,res,next)=>{
    try{
        const counts = await postsModel.remove(req.params.id);
        res.status(200).json(counts);
    }
    catch(err){
        next();
    }
});

postsRouter.use("/*",(req,res)=>{
    res.status(500).json({message:"server error"});
});

module.exports = postsRouter;