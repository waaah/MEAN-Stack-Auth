const express = require('express');
const router = express.Router();
const User = require("../models/users");
const config = require("../config/database");
const passport = require("passport");
const jwt = require("jsonwebtoken");

//register
router.post('/register',function(req,res){
  let newUser = new User({
    name:req.body.name,
    email:req.body.email,
    username:req.body.username,
    password:req.body.password
  });
  User.addUser(newUser,function(err,user){
    if(err){
      res.json({success:false,msg:"Failed to register user!"});
    }
    else{
      res.json({success:true,msg:"Successfully registered a user!"});
    }
  })
})
//authenticate
router.post('/authenticate',function(request,response){
  const username = request.body.username;
  const password = request.body.password;

  User.getUserByUsername(username, function(err,user){
    if(err) throw err;
    if(!user)
      return response.json({success:false, message: "User not found"});
    User.comparePassword(password,user.password , function(err, isMatch){
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({data:user},config.secret,{
          expiresIn: 604800, //seconds => 1 week
        });
        return response.json({
          success: true,
          token: "Bearer " + token,
          user:{
            id:user._id,
            name:user.name,
            username:user.username,
            email:user.email
          }
        })
      }
      else{
        return response.json({ success: false, message:'Wrong Password'})
      }
    });
  })
})
//profile
router.get('/profile', passport.authenticate('jwt',{session:false}),function(request,response){
  response.json({user: request.user});
})


module.exports = router;
