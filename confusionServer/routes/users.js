var express = require('express');
var passport = require('passport');
var router = express.Router();

const User = require('../models/user.js');
const authenticate = require('../authenticate.js');
/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*
This is using it along with express-session!;
router.post('/signup',(req,res,next)=>{
  User.findOne({username : req.body.username})
  .then((user)=>{
    if(!user){
      let err = new Error('Username already exits');
      err.status = 403;
      next(err);
    }
    else {
      return User.create({
        user: req.body.username,
        password: req.body.password
      })
      .then((user)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json({status:'Registration successful!'});
      })
    }
  })
  .catch((err)=> next(err));
})

router.post('/login',(req,res,next)=>{
  if(!req.session.user){
      var authHeader = req.headers.authorization;
        if(!authHeader){
          var err = new Error('Your are not authenticated');
          res.setHeader('WWWus-Authenticate','base64');
          err.status = 400;
          next(err);
        }
      const auth = new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');
      const user_ = auth[0];
      const pass = auth[1];
    User.findOne({ user : user_})
    .then((user)=>{
      if(user == null){
        var err = new Error('User '+ user_ +'does not exist');
        err.status = 403;
        next(err);
      }
      else if( user.password != pass ){
        var err = new Error('Your password is incorrect');//avoid
        err.status = 403;
         next(err);
      }
      else if(user.user === user_ && user.password === pass){
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type','text/plain');
        res.end('Enjoy your time here!');
      }
    })
    .catch(err => next(err));
  }
  else{
    res.statusCode = 200;
    res.setHeader('Content-Type','text/plain');
    res.end('You are already authenticated');
  }
})
*/


/*Using passport*/
router.post('/signup',(req,res,next) => {
  User.register(new User({username : req.body.username}),
                req.body.password,
                 (err,user) =>{
                   if(err){
                     res.statusCode = 500;
                     res.setHeader('Content-Type','application/json');
                     res.json({err : err});
                   }
                   else{
                     if(req.body.firstName)
                     {
                       user.firstName = req.body.firstName;
                     }
                     if(req.body.lastName)
                      user.lastName = req.body.lastName;
                    user.save((err,user)=>{
                      if(err){
                        res.statusCode = 500;
                        res.setHeader('Content-Type','plain/text');
                        res.json({err: err});
                        return;
                      }
                    passport.authenticate('local')(req,res,()=>{
                      res.statusCode = 200;
                      res.setHeader('Content-Type','application/json');
                      res.json({success:true , status: 'Registration successful'});
                    })
                  });
                }
              });
});

/*Using passport for login*/
//Note passport.authenticate can create errors when body Parser is not properly implemented

router.post('/login',
  passport.authenticate('local'),
  (req,res,next) => {
    console.log(req);
    var token = authenticate.getToken({
      _id: req.user.id
    });
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    res.json({
      sucess: true,
      token : token,
      status: 'You are successfully logged in'
    });
  });

router.get('/logout',(req,res,next)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('You are already logged  out');
    err.status = 403;
    res.send('Fuk')
  }
})

module.exports = router;
