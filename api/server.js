const express = require('express');
const usersRouter = require("./users/users-router");
const server = express();
//custom middlewares
const logger=(req,res,next)=>{
  console.log(`Method: ${req.method}, Request URL: ${req.originalUrl}, Time Stamp: ${new Date().getTime()}`);
  next();
};
// remember express by default cannot parse JSON in request bodies
server.use(express.json());
// global middlewares and the user's router need to be connected here
server.use(logger);
server.use("/api/users",usersRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});
server.use("/*",(req,res)=>{
  res.status(404).json({message:"endpoint not found"});
})

module.exports = server;
