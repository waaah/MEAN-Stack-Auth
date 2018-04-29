//REQUIRES
  const express = require("express");
  const path = require("path");
  const cors = require("cors");
  const bodyParser = require("body-parser");

  const passport = require("passport");
  const mongoose = require("mongoose");
  const config = require("./config/database");
//END OF REQUIRES

const app = express();
const port = process.env.port ||"3000";

mongoose.connect(config.database);

//connect to database
  mongoose.connection.once('open',function(){
    console.log("Connected to Database " + config.database);
  }).on('error',function(err){
    console.log("Error "+err);
  })
//end of connect to database
/*ROUTES*/
  const users = require("./routes/users");
/*END OF ROUTES*/

//CORS
  app.use(cors());

//set static folder
  app.use(express.static(path.join(__dirname,'public')));

//Body Parser Middleware
  app.use(bodyParser.json());

//Passport Middleware
  app.use(passport.initialize());
  app.use(passport.session());
  require("./config/passport")(passport);

//ROUTES
  app.use("/users",users);
//END OF ROUTES

app.listen(port,function(res,req){
  console.log("Server Started" + port);
})
