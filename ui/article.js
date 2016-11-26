console.log("loaded article.js");


    

    


//fetch articles

function fetchArticles(cat){
   
      var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var heading = document.getElementById('heading');
            var category = document.getElementById('category');
            var author = document.getElementById('author');
            var tags  = document.getElementById('tags');
            var content  = document.getElementById('content');
            var time  = document.getElementById('time');
            if (request.status === 200) {
                 var data = JSON.parse(this.responseText);
                
  
                 var pane='';
                 for(var k=0;k<data.length;k++){
                       var aut=`${data[k].author_id}`;
                     var id= `${data[k].id}`;
        
        
                     pane+=`<div class='container'><div class='row'><div class="col-sm-9">
                    <div class="row text-center">
                    
                     </div>
                             <hr>
                                        <h1 id="heading">${data[k].heading}</h1>                      
                     <h4>
                     <span class="label label-primary" id="category">${data[k].category}</span>
                    </h4>
                     <h5>
                          <span id="author">...</span>
                          <span id="time">${data[k].time.split('T')[0]}</span>
                     </h5>
          
                      <h5>
                         <span id="tags">...</span>
                     </h5>
       <br>
      <div id="content">
                <p><strong>${data[k].content}</strong><p></div>
    
       </div>
       
      <hr>
<span id="leavecomment">  <h4>Comments...</h4>
  <!-- 
      <form role="form">
        <div class="form-group">
          <textarea class="form-control" rows="3" required></textarea>
        </div>
        <button type="submit" class="btn btn-success">Submit</button>
      </form>
      <br><br>
      
      <p><span class="badge" id="total-comments">2</span> Comments:</p><br>
      
      <div class="row">
        <div class="col-sm-2 text-center">
          <img src="bandmember.jpg" class="img-circle" height="65" width="65" alt="Avatar">
        </div>
        <div class="col-sm-10">
          <h4>Anja <small>Sep 29, 2015, 9:12 PM</small></h4>
          <p>Keep up the GREAT work! I am cheering for you!! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <br>
        </div>
        <div class="col-sm-2 text-center">
          <img src="bird.jpg" class="img-circle" height="65" width="65" alt="Avatar">
        </div>
        <div class="col-sm-10">
          <h4>John Row <small>Sep 25, 2015, 8:25 PM</small></h4>
          <p>I am so happy for you man! Finally. I am looking forward to read about your trendy life. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <br>
          <p><span class="badge">1</span> Comment:</p><br>
          <div class="row">
            <div class="col-sm-2 text-center">
              <img src="bird.jpg" class="img-circle" height="65" width="65" alt="Avatar">
            </div>
            <div class="col-xs-10">
              <h4>Nested Bro <small>Sep 25, 2015, 8:28 PM</small></h4>
              <p>Me too! WOW!</p>
              <br>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


-->
</span>
 </div>
</div></div>
`;
         
         document.getElementById('articlePane').innerHTML=pane;
           getTags(id);
        getAuthor(aut);
        
                 }
                }
               
             else {
            alert("Sorry No!articles In this category!!!");
               
            }
        }
    };
    
        request.open('POST', '/getArticles', true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.send(JSON.stringify({category:cat}));     
}


//getUthor name
function getAuthor(author_id){
     var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
        
              if (request.status === 200) {
                  var data = JSON.parse(this.responseText);
                   var author = document.getElementById('author');
          
         author.innerHTML=         `<span class="glyphicon glyphicon-time"></span> Post By, <b>${data[0].name}</b>`;
              } else {
                  
              }
          }
        };
    
    
    request.open('POST', '/getAuthor', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({author_id:author_id}));     
  
}


//get tags
function getTags(id){
    var request = new XMLHttpRequest();
        
       
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
        
              if (request.status === 200) {
                  var data = JSON.parse(this.responseText); 
                  var x="";
               for(var j=0;j<data.length;j++){
                   x+=`<span class="label label-success">${data[j].tag}</span>&nbsp;`;
               }
            document.getElementById('tags').innerHTML=x;
              } else {
                 
              }
          }
        };
    
     request.open('POST', '/getTags', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({id:id}));  
    
    
}







//load categories
var catbtn=document.getElementById('catbtn');
catbtn.onclick=function () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var categories = document.getElementById('categories');
            if (request.status === 200) {
                var content ="<ul class='list-group' style='width:300px'>";
                var CategoryList = JSON.parse(this.responseText); 
                for (var i=0; i< CategoryList.length; i++) {
                    content += `
                   <li class="list-group-item">  <button class="btn btn-warning" id="${CategoryList[i].name}" name="${CategoryList[i].name}" onclick="fetchArticles(this.name)">${CategoryList[i].name}</button></li>
                   `;
                }
                content+="</ul>";
                categories.innerHTML = content;
            } else {
                categories.innerHTML('Oops! Could not load all articles!');
            }
        }
    };
    
    request.open('GET', "/get-categories", true);
    request.send();
 
};



//load initially latest article
            function loadBlogData(articleData,i) {
            var heading = document.getElementById('heading');
            var category = document.getElementById('category');
            var author = document.getElementById('author');
            var tags  = document.getElementById('tags');
            var content  = document.getElementById('content');
            var time  = document.getElementById('time');
             heading.innerHTML=`<h1>${articleData[i].heading}</h1>`;
               category.innerHTML=`${articleData[i].category}`;
               author.innerHTML=`<span class="glyphicon glyphicon-time"></span> Post By, <b>${articleData[i].name}</b>`;   
               content.innerHTML=`${articleData[i].content}`;
               time.innerHTML=`${articleData[i].time.split('T')[0]}`;
           var x="";
               for(var j=0;j<articleData.length;j++){
                   x+=`<span class="label label-success">${articleData[j].tag}</span>&nbsp;`;
               }
               tags.innerHTML=x;
            
              
    }


//perform on windows start.
window.onload=function() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
             var content  = document.getElementById('content');
            if (request.status === 200) {
                var articleData = JSON.parse(this.responseText);
               loadBlogData(articleData,0);
             
            } else {
             content.innerHTML=`<b>Error Fetching Content</b>`;
            }
        }
    };
    
    request.open('GET', '/get-blog-data', true);
    request.send();
};







 
    var register = document.getElementById('register_btn');
    register.onclick = function () {
      
        var request = new XMLHttpRequest();
        
      
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
            
              if (request.status === 200) {
                  alert('User created successfully');
                  register.value = 'Registered!';
              } else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
        
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        console.log(name);
        console.log(email);
        console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({name:name,email:email, password: password}));  
        register.value = 'Registering...';
    
    };