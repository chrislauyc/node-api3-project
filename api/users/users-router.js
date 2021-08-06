const express = require('express');
const userModel = require("./users-model");
const postsModel = require("../posts/posts-model");
const {validatePost, validatePostId} = require("../posts/posts-middleware");
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

// middlewares
const validateUserId=async(req,res,next)=>{
  try{
    const user = await userModel.getById(req.params.id);
    if(user){
      next();
    }
    else{
      res.status(404).json({ message: "user not found" });
    }
  }
  catch{
    next();
  }
};
const validateUser=async(req,res,next)=>{
  try{
    const {name} = req.body;
    if(name){
      next();
    }
    else{
      res.status(400).json({ message: "missing required name field" });
    }
  }
  catch{
    next();
  }
};

router.get('/', async(req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try{
    const users = await userModel.get();
    res.status(200).json(users);
  }
  catch{
    next();
  }
  
});


router.get('/:id', validateUserId, async(req, res,next) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  try{
    const user = await userModel.getById(req.params.id);
    res.status(200).json(user);
  }
  catch{
    next();
  }
});

router.post('/',validateUser, async(req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  try{
    const newUser = await userModel.insert(req.body);
    res.status(201).json(newUser);
  }
  catch{
    next();
  }
});

router.put('/:id',validateUserId,validateUser, async(req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try{
    const updatedUser = await userModel.update(req.params.id,req.body);
    res.status(200).json(updatedUser);
  }
  catch{
    next();
  }
});

router.delete('/:id', validateUserId ,async(req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try{
    const user = await userModel.getById(req.params.id);
    const counts = await userModel.remove(req.params.id);
    if(counts!==0){
      res.status(200).json(user);
    }
    else{
      next();
    }
  }
  catch{
    next();
  };
});

router.get('/:id/posts', validateUserId, async(req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try{
    const posts = await userModel.getUserPosts(req.params.id);
    res.status(200).json(posts);
  }
  catch{
    next();
  }

});

router.post('/:id/posts', validateUserId, validatePost, async(req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try{
    const newPost = await postsModel.insert({...req.body,user_id:req.params.id});
    res.status(201).json(newPost);
  }
  catch{
    next();
  };
});

router.use("/*",(req,res)=>{
  res.status(500).json({message: "server error"});
});

// do not forget to export the router
module.exports = router;