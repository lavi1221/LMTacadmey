
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
if (window.pageYOffset > sticky) {
 header.classList.add("sticky");
 header.classList.remove("navitt");
} else {
 header.classList.add("navitt");
 header.classList.remove("sticky");
}
}
