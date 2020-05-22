
var frm = document.getElementById("regis");
frm.addEventListener('submit',function(e){
  var t = frm.querySelectorAll('input');
  var tpass = t[1].value;
  var cpass  = t[2].value;
  if(tpass != cpass){
     e.preventDefault();
      swal("Password doesnt Match");
  }
});
