const express = require('express'),
      bodyParser = require('body-parser'),
      dishRouter = express.Router();
dishRouter.use(bodyParser.json());
dishRouter.route('/')
.all(function(req,res,next){
  console.log("Hitting the all series");
  next();
})
.get((req,res)=>{
  console.log(req.body);
  res.send("Request Received");
})
.post((req,res)=>{
  console.log(req.body);
  res.send("Content received");
})
.put((req,res)=>{
  console.log(req.body);
  res.statusCode = 403;
  res.send("PUT operation not supported");
})
.delete((req,res)=>{
  console.log(req.body);
  res.send("Deleting all dishes");
});


dishRouter.route('/:dishId')
.all((req,res,next)=>{
  console.log(req.params);
  next();
})
.get((req,res)=>{
  res.send('details of dish '+req.params.dishId);
})
.post((req,res)=>{
  res.send('Post operation not supportedd on /dishes/'+req.params.dishId);
})
.put((req,res)=>{
  res.send("Dish details updated");
})
.delete((req,res)=>{
  res.send("Dish deleted" + req.params.dishId);
});

module.exports = dishRouter;
