//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const passport=require("passport");
const swal=require("sweetalert");
const session =require("express-session");
const date =require("date-and-time");
const nodemailer=require("nodemailer");
const fs = require('fs');

const app=express();
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      user: process.env.USER,
      pass: process.env.PASS
    }
});

var bd={};
var num=0;
var scrt=[];
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
  secret:"dark secret.",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin:test123@cluster0-6ef3z.mongodb.net/userDB",{useUnifiedTopology: true,useNewUrlParser: true});
mongoose.set("useCreateIndex",true);

const userSchema= new mongoose.Schema({
  username:String,
  password:String,
  gender:String,
  phoneNo:Number,
  sem:String
});
const adminSchema= new mongoose.Schema({
  username:String,
  arr:[]
});

userSchema.plugin(passportLocalMongoose);

const User=new mongoose.model("User",userSchema);
const Admin = new mongoose.model("Admin",adminSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.get("/",function(req,res){
  res.sendFile(__dirname+"/home.html");
});
app.get("/home",function(req,res)
{
  res.redirect("/");
});
app.get("/reg_form",function(req,res){
  res.sendFile(__dirname+"/reg_form.html");
});
app.get("/log_form",function(req,res){
  res.sendFile(__dirname+"/log_form.html");
});
app.get("/about",function(req,res)
{
  res.render("about");
});
app.get("/profile",function(req,res){
  if(req.isAuthenticated()){
    res.render('profile',{ user: req.user});
  }else{
  res.redirect("log_form");
 }
});
app.get("/userHome/:customSub",function(req,res){
  if(req.isAuthenticated()){
    var val=req.params.customSub;
    fs.readFile('videos.json',function(error,data){
      if(error){
        res.status(500).end();
      }else{
        var newData = JSON.parse(data);
        for (var i = 0; i < newData.length; i++){
            if (newData[i].Sub == val){
            break;
            }
        }
        res.render("resource.ejs",{
          subject: newData[i]
        });

      }
    });
    }else{
   res.redirect("/log_form");
  }

});
app.get("/userHome/resource/:customSub",function(req,res){
  if(req.isAuthenticated()){
    fs.readFile('videos.json',function(error,data){
      if(error){
        res.status(500).end();
      }else{
        var val=req.params.customSub;
        var newData = JSON.parse(data);
        for (var i = 0; i < newData.length; i++){
            if (newData[i].Sub == val){
            break;
            }
        }

        res.render('video.ejs',{
          videos : newData[i]
        })
      }
    });

  }else{
  res.redirect("/log_form");
  }
});
app.get("/userHome",function(req,res){
  if(req.isAuthenticated()){
    Admin.findById("5ec80b1dd8d3053ba88a0184",function(err,foundUser){
    if(err){
       console.log(err);
      }else{
        if(foundUser){
          res.render('userHome',{ user: req.user, disc:foundUser.arr});
        }
      }
     });
   }else{
   res.redirect("log_form");
   }
});
app.get("/verify",function(req,res){
  res.render("otp");
});
app.post("/verify",function(req,res){
  if(req.body.otp==num){
    User.register({username:bd.username,gender:bd.gender,sem:bd.sem,phoneNo:bd.PhoneNo},bd.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("reg_form");
    }else{
        res.redirect("log_form");
    }
  });
 }else{
   swal('OTP mismatch');
   res.redirect("reg_form");
}
});
app.post("/reg_form",function(req,res){
  bd=req.body;
  num=Math.floor((Math.random()*1000000)+1);
 if(req.body.password!=req.body.Password2){
  swal('Password does not match.')
   res.redirect("reg_form");
 }else{
   const mailOption={
   from : process.env.USER ,
   to : req.body.username,
   subject: "OTP verification",
   html: "<h3>OPT is</h3> <h1>"+ num + "</h1>.<br> <p> Please Enter this Otp.</p>"
 };

 transporter.sendMail(mailOption, function(error, info){
   if (error) {
     console.log(error);
   } else {
     console.log('Email sent: ' + info.response);
   }
 });
   res.redirect("verify");
 }
});
app.post("/log_form",function(req,res){
  const user=new User({
     username:req.body.username,
     password:req.body.password
   });
   req.login(user,function(err){
     if(err){
       console.log(err);
     }else{
       passport.authenticate("local")(req,res,function(){
         res.redirect("userHome");
       });
     }
   });
});
app.post("/contact",function(req,res){
  const mailOption={
  from : process.env.USER ,
  to : process.env.USER,
  subject: req.body.Email+" has sent a message",
  html: "<h3>Message is</h3> <p>" + req.body.name +"</p>."
};

transporter.sendMail(mailOption, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

res.redirect("/");
});
app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});
app.post("/submit",function(req,res){
    var head=req.body.name;
    const now = new Date();
   const today=date.format(now, ' hh:mm A ddd, MMM DD');

    var obj ={
     content: head,
     name:req.user.username,
     date:today
   };

   Admin.findById("5ec80b1dd8d3053ba88a0184",function(err,foundUser){
      if(err){
       console.log(err);
      }else{
        if(foundUser){
          foundUser.arr.push(obj);
          foundUser.save();
        };
      }
    });
  res.redirect("userHome");
});

let port=process.env.PORT;
if( port == null || port=="" ){
  port=3000;
}
app.listen(port,function(){
  console.log("Server is started");
});
