const express = require('express'),
      bodyParser = require('body-parser'),
      promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all((req,res,next)=>{
  console.log("Generalised method for all promotions ");
  next();
})
.get((req,res)=>{
  res.statusCode = 200;
  res.send("Heres's your promotion");
})
.post((req,res)=>{
  res.send("Promotion registered");
})
.put((req,res)=>{
  res.send("PUT operation invalid");
})
.delete((req,res)=>{
  res.send("All promotions deleted");
});


promotionRouter.route('/:promoId')
.all((req,res,next)=>{
  console.log("User authenticated");
  res.setHeader('Content-Type','type/text')
  res.statusCode = 200;
  next();
})
.post((req,res)=>{
  res.statusCode = 403;
  res.end('Operation not allowed');
})
.put((req,res)=>{
  res.statusCode = 200;
  res.end('Promo updated');
})
.delete((req,res)=>{
  res.statusCode = 200;
  res.end('Promo deleted successfully');
})

module.exports = promotionRouter;
