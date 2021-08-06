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
module.exports={
    validatePost,
    validatePostId
};