var createError = require('http-errors');
var express = require('express');
var path = require('path');
var passport = require('passport');
var authenticate = require('./authenticate.js');
/*cookieParaser used to parse cookie from the req header as welll as handle the cookies in general*/
//var cookieParser = require('cookie-parser');

//Setting up a session
//var session = require('express-session');

//Setting up a place to store sessions so the sessions persist even when the server goes down
//var FileStore = require('session-file-store')(session);
var logger = require('morgan');

const mongoose = require('mongoose');

//Configuration settings
var config = require('./config');
/*Models*/

/*Routes*/
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.js');
var dishRouter = require('./routes/dishRouter.js');
var promoRouter = require('./routes/promotionRouter.js');
var leaderRouter = require('./routes/leaderRouter.js');
var app = express();

//app.use(cookieParser('developmentInProgress')); // passing the cookieParser middleware to express app inorder to parse the req header for the cookie as well as to sign the cookie with a secret key inorder to store its value.
/*
app.use(session({
  name: 'session-Id',
  secret : "12345678",
  resave: false,
  saveUninitalised : false,
  store: new FileStore()
}));
*/
//  if(!req.signedCookies.user){ //checking if a cookie has been sent with name==user field. This is for using cookies
//  if(!req.session.user){  // this is for using a persistent session
/* For express-session

function auth(req,res,next) {
  console.log(req.session);
  if(!req.session.user){
    var err = new Error('You are not authenticated');
    err.status = 403;
    next(err);
  }
  else {
    if (req.session.user == "authenticated"){
      next();
    }
    else{
      var err = new Error('You are not authenticated');
      err.status = 403;
      next(err);
    }
  }
}
*/
/*
function auth(req,res,next){
  if(!req.user){
    var err = new Error('You are not authenticated');
    err.status = 403;
    next(err);
  }
  else{
    next();
  }
}*/

// DataBase connection setup
const url = config.mongoUrl;
const connect = mongoose.connect(url);

/*
connect
.then((db)=>{
 console.log("DataBase server found");

})
.catch((err)=>{console.log(err)})
*/
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));/*This sets up my morgan logger*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/',indexRouter);
function debug (req,res,next){
  console.log(req.body);
  next();
};
app.use(debug);
app.use('/', usersRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);
app.use('/dishes',dishRouter);

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
