const express = require('express'),
      bodyParser = require('body-parser'),
      dishRouter = express.Router(),
      authenticate = require('../authenticate');
const Dishes = require("../models/dishes.js");
dishRouter.use(bodyParser.json());

/*dishes router*/
/*
Handling error is important
Prominent error are errors like
Searching the database for a value but the value returned is null
then if in processing this hasnt been taken care of then the server will crash with an error when trying to access any subcomponent of the result or trying to process the result in any other format
*/
/*
Well session works
PS: look into what mergeParams option does
*/
/*
function checking(req,res,next){
  req.session.user = "Sucker";
  console.log(req.session)
  next();
}
dishRouter.use(checking);
*/
dishRouter.route('/')
.get((req,res,next)=>{
  Dishes.find({})
  .populate('comments.author')
  .then((dishes) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(dishes);
  },(err)=> next(err))
  .catch((err)=>next(err))
})
.post(authenticate.verifyUser,(req,res,next)=>{
  Dishes.create(req.body)
  .then((dish)=>{
    console.log('Dish Created',dish);
    res.stauseCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(dish);
  },(err)=>next(err))
  .catch((err)=> next(err))
})
.put(authenticate.verifyUser,(req,res)=>{
  res.statusCode = 403;
  res.send("PUT operation not supported");
})
.delete(authenticate.verifyUser,(req,res,next)=>{
  Dishes.remove({})
  .then((resp)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json')
    res.json(resp);
  })
  .catch((err)=>next(err)) // next(err) passes the error to be handled by the global error handlers of sort
});


dishRouter.route('/:dishId')
.get((req,res,next)=>{
  Dishes.find({_id:req.params.dishId})
  .populate('comments.author')
  .then((dish)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(dish);
  })
  .catch((err)=> next(err));
})
.post(authenticate.verifyUser,(req,res)=>{
  res.send('Post operation not supportedd on /dishes/'+req.params.dishId);
})
.put((req,res)=>{
  Dishes.findByIdAndUpdate(req.params.dishId,{
    $set : req.body
  },{new :true})
  .then((dish)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(dish);
  })
  .catch((err)=>next(err))
})
.delete((req,res)=>{
  Dishes.findByIdAndRemove(req.params.dishId)
  .then((resp)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
  })
  .catch((err)=> next(err))
});

dishRouter.route('/:dishId/comment')
.get((req,res,next)=>{
  Dishes.find({_id : req.params.dishId})
  .populate('comments.author')
  .then((dish)=>{
    console.log(dish[0].comments)
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(dish[0].comments);
  })
  .catch((err)=>{next(err)})
})
.post(authenticate.verifyUser,(req,res,next)=>{
  Dishes.findOne({_id: req.params.dishId})
  .then((dish)=>{
    if(dish!=null){
      req.body.author = req.user._id;
      dish.comments.push(req.body);
      dish.save()
      .then((dish)=>{
        res.statusCode = 202; //202 - Acceped
        res.setHeader('Content-Type','application/json');
        res.send("post registered successfully");
      },(err) => next(err));
    }
    else{
      err = new Error('Dish' + req.params.dishId + 'not found');
      err.status = 404;
      return next(err);
    }
  })
  .catch((err)=>{next(err)})
})
.put((req,res,next)=>{
  res.statusCode = 403; // Forbidden - 403
  res.setHeader('Content-Type','text/plain');
  res.end('Action Not allowed');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
  Dishes.findOne({_id:req.params.dishId})
  .then((dish)=>{
    if(dish != null){
      for(var i=(dish.comments.length -1);i>=0;i--){
        dish.comments.id(dish.commetns[i]._id).remove();
      }
      dish.save()
      .then((dish)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish.comments);
      })
      .catch((err)=> next(err))
    }
    else{
      err = new Error('Dish'+req.params.dishId+'not found');
      err.status = 400;
      return next(err);
    }
  })
  .catch((err)=> next(err));
})

dishRouter.route('/:dishId/:commentId')
.get((req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .populate('comments.author')
  .then((dish)=>{
    if(dish!=null && dish.comments.id(req.params.commentId)!=null){
      res.statusCode = 200;
      res.setHeader('Content-Type','application/json');
      res.json(dish.comments.id(req.params.commentId));
    }
    else if (dish== null){
      err = new Error('Dish Not found');
      err.statusCode = 404;
      next(err);
    }
    else{
      err = new Error('Comment Not found');
      err.statusCode = 404;
      next(err);
    }
  })
  .catch(err => next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
  res.statusCode = 403;
  res.setHeader('Content-Type','application/json');
  res.end('Access Not Grated');
})
.put(authenticate.verifyUser,(req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});
module.exports = dishRouter;
