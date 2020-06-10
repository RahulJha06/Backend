/*
make restful routes for dish
*/
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const dishRouter = require('./dishRouter.js');
const leaderRouter = require('./leaderRouter.js');
const promoRouter = require('./promotionRouter.js');
const app  = express();
app.use(bodyParser.json());
const hostname = 'localhost';
const port = 3000;
/*
function trying(req,res,next){
  console.log(req.headers);
  next();
}
app.use(trying);*/
app.use('/dishes',dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter);
app.listen(port,hostname,()=>{
  console.log('Server listenning');
})
