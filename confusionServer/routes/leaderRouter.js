const express = require('express'),
      bodyParser = require('body-parser'),
      leaderRouter = express.Router();

/*Models*/
var Leader = require('../models/leaderSchema.js');
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req,res,next)=>{
  Leader.find({})
  .then((leaders)=>{
    console.log(leaders);
    res.send(leaders);
  })
  .catch((err)=>{console.log('erroor')})
})
.post((req,res,next)=>{
  Leader.create(req.body)
  .then((leader)=>{
    Leader.find({})
    .then((leader)=>{
      console.log(leader);
      res.send(leader);
    })
  .catch((err)=>{next(err)})
  })
})
.put((req,res,next)=>{
  res.statusCode = 403;
  res.setHeader('Content-Type','text/plain');
  res.end('Method not valid')
})
.delete((req,res)=>{
  Leader.remove({})//never write this without proper authetication!.
  res.send("All leaders deleted");
});


leaderRouter.route('/:leaderId')
.get((req,res,next)=>{
  Leader.findbyId(req.params.leaderId)
  .then((leaders)=>{
    res.send(leaders);
  })
  .catch((err)=>{console.log('erroor')})
})
.post((req,res)=>{
  res.statusCode = 403;
  res.end('Operation not allowed');
})
.put((req,res)=>{
  Leader.findByIdAndUpdate(req.params.leaderId,
    {$set:req.body},
    {new : true}
  )
  .then((leaders)=>{
    Leader.findById(req.params.leaderId)
    .then((leader)=>{
      res.send(leader);
    })
    .catch((err)=>next(err))
  })
  .catch((err)=>{console.log('erroor')})
})
.delete((req,res)=>{
  ishes.findByIdAndRemove(req.params.leaderId)
  .then((resp)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
  })
  .catch((err)=> next(err))
})

module.exports = leaderRouter;
