const express = require('express'),
      bodyParser = require('body-parser'),
      promoRouter = express.Router();

/*models*/
const promo = require('../models/promotions.js');
promoRouter.use(bodyParser.json());
promoRouter.route('/')
.get((req,res,next)=>{
  promo.find({})
  .then((promos)=>{
    console.log(promos);
    res.send(promos);
  })
  .catch((err)=>{console.log('erroor')})
})
.post((req,res,next)=>{
  promo.create(req.body)
  .then((promo)=>{
    promo.find({})
    .then((promo)=>{
      console.log(promo);
      res.send(promo);
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
  promo.remove({})//never write this without proper authetication!.
  res.send("All promos deleted");
});


promoRouter.route('/:promoId')
.get((req,res,next)=>{
  promo.findbyId(req.params.promoId)
  .then((promos)=>{
    res.send(promos);
  })
  .catch((err)=>{console.log('erroor')})
})
.post((req,res)=>{
  res.statusCode = 403;
  res.end('Operation not allowed');
})
.put((req,res)=>{
  promo.findByIdAndUpdate(req.params.promoId,
    {$set:req.body},
    {new : true}
  )
  .then((promos)=>{
    promo.findById(req.params.promoId)
    .then((promo)=>{
      res.send(promo);
    })
    .catch((err)=>next(err))
  })
  .catch((err)=>{console.log('erroor')})
})
.delete((req,res)=>{
  ishes.findByIdAndRemove(req.params.promoId)
  .then((resp)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
  })
  .catch((err)=> next(err))
})

module.exports = promoRouter;
