const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt =  require("passport-jwt").ExtractJwt;
const User = require("../models/users");
const config = require("../config/database");

module.exports = function(passport){
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  console.log(opts);
  passport.use(new jwtStrategy(opts, function(jwt_payload,done){
    console.log(jwt_payload);
    User.getUserById(jwt_payload.data._id , function(err, user) {
      if(err)
        return done(err, false);
      if(user)
        return done(null,user);
      else {
        return done(null,false);
      }
    })
  }));
}
