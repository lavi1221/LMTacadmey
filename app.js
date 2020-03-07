//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const app=express();


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/home.html");
});

app.get("/reg_form",function(req,res){
  console.log("clicked");
  res.sendFile(__dirname+"/reg_form.html");
});

app.get("/log_form",function(req,res){
  res.sendFile(__dirname+"/log_form.html");
});

app.listen("3000",function(){
  console.log("Server is started");
});
