var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var ExtractJwt = require('passport-jwt').ExtractJwt;
var JwtStrategy = require('passport-jwt').Strategy  ;
var jwt = require('jsonwebtoken');
  //jwt is used to create,sign and verify tokens

var config = require('./config');


// Producing a token that expires in an hour

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts,
    (jwt_payload,done)=>{
      console.log("Jwt payload",jwt_payload);
    User.findOne({_id: jwt_payload._id},
      (err,user)=>{
        if(err){
          return done(err,false);
        }
        else if (user){
          return done(err,user);
        }
        else{
          return done(err,false);
        }
    })
    }));

exports.verifyUser = passport.authenticate(
  'jwt',
  {session: false}
);
//These are configuration for using passport
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//This generates the token and return the signed token
exports.getToken = function(user){
  return jwt.sign(user, config.secretKey,{expiresIn: 3600});
};
