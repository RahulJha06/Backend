const express = require('express'),
      bodyParser = require('body-parser'),
      leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res)=>{
  console.log("Generalised method for all leader methods ");
  next();
})
.get((req,res)=>{
  res.statusCode = 200;
  res.send("Heres's all the current ");
})
.post((req,res)=>{
  res.send("leader  registered");
})
.put((req,res)=>{
  res.send("PUT operation invalid");
})
.delete((req,res)=>{
  res.send("All leaders deleted");
});


leaderRouter.route('/:leaderId')
.all((req,res,next)=>{
  console.log("User authenticated");
  res.setHeader('Content-Type','type/text')
  next();
})
.get((req,res)=>{
  res.statusCode = 200;
  res.end('leader with id ' +req.params.leaderId+' sent');
})
.post((req,res)=>{
  res.statusCode = 403;
  res.end('Operation not allowed');
})
.put((req,res)=>{
  res.statusCode = 200;
  res.end('leader updated');
})
.delete((req,res)=>{
  res.statusCode = 200;
  res.end('leaderdeleted successfully');
})

module.exports = leaderRouter;
