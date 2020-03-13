//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');
const passport=require("passport");
const Swal=require("sweetalert2");
const session =require("express-session");
const date =require("date-and-time");

const app=express();

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

mongoose.connect("mongodb+srv://admin-lmt:test123@cluster0-a1p6w.mongodb.net/userDB",{useUnifiedTopology: true,useNewUrlParser: true});
mongoose.set("useCreateIndex",true);

const userSchema= new mongoose.Schema({
  username:String,
  password:String,
  gender:String,
  phoneNo:Number,
  sem:String,
  arr:[]
});

userSchema.plugin(passportLocalMongoose);

const User=new mongoose.model("User",userSchema);

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

app.get("/reg_form",function(req,res){
  res.sendFile(__dirname+"/reg_form.html");
});

app.get("/log_form",function(req,res){
  res.sendFile(__dirname+"/log_form.html");
});

app.get("/profile",function(req,res){
  if(req.isAuthenticated()){
    res.render('profile',{ user: req.user});
  }else{
  res.redirect("log_form");
 }
});

app.get("/userHome",function(req,res){
  if(req.isAuthenticated()){
     User.findById("5e6bb3c7556517566c65eb84",function(err,foundUser){
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

app.post("/reg_form",function(req,res){
 if(req.body.password!=req.body.Password2){
  Swal.fire('Password does not match.')
   res.redirect("reg_form");
 }else{
   User.register({username:req.body.username,gender:req.body.gender,sem:req.body.sem,phoneNo:req.body.PhoneNo},req.body.password,function(err,user){
   if(err){
     console.log(err);
     res.redirect("reg_form");
   }else{
     passport.authenticate("local")(req,res,function(){
       res.redirect("userHome");
     });
   }
 });
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

  User.findById("5e6bb3c7556517566c65eb84",function(err,foundUser){
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
