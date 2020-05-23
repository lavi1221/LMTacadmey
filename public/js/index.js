
function change(){
var t = document.getElementById("less");
 if(t.textContent.indexOf("More")>=0){
   t.textContent= "Less Courses";
 }else{
   t.textContent= "More Courses";
 }
}

window.onscroll = function() {myFunction()};

var header = document.getElementById("navi");
var sticky = header.offsetTop;

function myFunction() {
  var ob =document.getElementById("blok");
 var op =document.getElementById("blok1");
if (window.pageYOffset > sticky) {
  ob.style.display = 'block';
  op.style.display = 'block';
 header.classList.add("sticky");
 header.classList.remove("navitt");
} else {
  ob.style.display ='none';
  op.style.display ='none';
 header.classList.add("navitt");
 header.classList.remove("sticky");
}
}
