console.log('Loaded!');



/* activate sidebar */
$('#sidebar').affix({
  offset: {
    top: 10
  }
});
(function($) {

  $.fn.visible = function(partial) {
    
      var $t            = $(this),
          $w            = $(window),
          viewTop       = $w.scrollTop(),
          viewBottom    = viewTop + $w.height(),
          _top          = $t.offset().top,
          _bottom       = _top + $t.height(),
          compareTop    = partial === true ? _bottom : _top,
          compareBottom = partial === true ? _top : _bottom;
    
    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

  };
    
})(jQuery);


/* activate scrollspy menu */
$('body').scrollspy({
  target: '#navbar-collapsible',
  offset: 50
});

/* smooth scrolling sections */
$('a[href*=#]:not([href=#])').click(function() {
  if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
    if (target.length) {
      $('html,body').animate({
        scrollTop: target.offset().top - 50
      }, 1000);
      return false;
    }
  }
});


var aniClass = "pullDown";
$(".dropdown-menu li a").click(function(){
  var selText = $(this).text();
  $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
  aniClass = selText;
});


function applyAnimation(){
    var imagePos = $(this).offset().top;
    
    var topOfWindow = $(window).scrollTop();
    var repeat = false;
    if (imagePos < topOfWindow+500) {
      var ele = $(this);
      ele.addClass(aniClass);
     
      if (repeat) {
        setTimeout(function(){
          ele.removeClass(aniClass);
        },1000);
      }
    }
  }

$('h1').each(applyAnimation);
$(window).scroll(function() {
  $('i,img,.list-group').each(applyAnimation);
});

//show address onclick
function show_address(){
var element=document.getElementById('address');
element.innerHTML= '<br>c1-20,Shashtri nagar ,Ghaziabad(201202)';
}

//MOve MY PROFILE PIC
/*

var img= document.getElementById('imgi');
var rad=0;
function makebig(){
rad=rad+2;
img.style.width=rad+'px';
img.style.height=rad+'px';
img.style.borderRadius=rad+'px';
if(rad==150){
alert("welcome");
}
}
img.onload=function(){
var a=setInterval(makebig,20);
};
*/

//Click counter
/*
var button=document.getElementById('button');
var counterTxt=document.getElementById('counterTxt');
var counter=0;
button.onclick=function(){
counter++;
counterTxt.innerHTML= counter.toString();

}

*/
/*
//AJAX HTTP_REQUEST
 var btn=document.getElementById('ctrbtn');
 var counter;
 btn.onclick=function(){
 //create a request object
 var request=new XMLHttpRequest();
 //capture response and store it in variable
 request.onreadystatechange=function(){
 if(request.readyState===XMLHttpRequest.DONE){
   if(request.status===200){
   var counter=request.responseText;
   var span=document.getElementById('counterTxt');
   span.innerHTML=counter.toString();
   }
 }
 //not done yet
 };
 //make request
 request.open('GET','http://itsinayats.imad.hasura-app.io//counter',true);
 request.send(null);
 };

*/


//TESTING WITH MYSELF of COUNTER:
var btn=document.getElementById('ctrbtn');
btn.onclick=function(){

var request=new XMLHttpRequest();

request.onreadystatechange=function(){
if(request.status==200){
document.getElementById('counterTxt').innerHTML=this.responseText;
}
};
//request.open('GET',"http://itsinayats.imad.hasura-app.io/counter",true);
request.open('GET',"http://localhost:8080/counter",true);
request.send();
}

//GETTING NAME//

var submitbtn=document.getElementById('submitbtn');
submitbtn.onclick=function(){

var request=new XMLHttpRequest();
request.onreadystatechange=function(){
if(request.readyState===XMLHttpRequest.DONE){
if(request.status===200){
var names=request.responseText;
names=JSON.parse(names);
var list='';
for(var i=0;i<names.length;i++){
list+='<li>'+names[i]+'</li>';
}
var ul=document.getElementById('namelist');
ul.innerHTML=list;
}
}
};
var nameInput=document.getElementById('name');
var name=nameInput.value;
//request.open('GET','http://itsinayats.imad.hasura-app.io/submit_name?name='+name,true);
request.open('GET','http://localhost:8080/submit_name?name='+name,true);
request.send(null);

};
















