console.log("loaded article.js");

var catbtn=document.getElementById('catbtn');
catbtn.onclick=function () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var categories = document.getElementById('categories');
            if (request.status === 200) {
                var content =  "<ul class='list-group' style='width:300px'>";
                var CategoryList = JSON.parse(this.responseText);                                      
                for (var i=0; i< CategoryList.length; i++) {
                    content += `
                     <li class="list-group-item">${CategoryList[i].name}<span class="badge">12</span></li>
                   `;
                }
                content += "</ul>";
                categories.innerHTML = content;
            } else {
                categoriess.innerHTML('Oops! Could not load all articles!');
            }
        }
    };
    
    request.open('GET', "/get-categories", true);
    request.send();
 
};


function loadBlogData(articleData,i) {
            var heading = document.getElementById('heading');
            var category = document.getElementById('category');
            var author = document.getElementById('author');
            var tags  = document.getElementById('tags');
            var content  = document.getElementById('content');
            var time  = document.getElementById('time');
            
               heading.innerHTML=`<h1>${articleData[i].heading}</h1>`;
               category.innerHTML=`${articleData[i].category}`;
               author.innerHTML=`<span class="glyphicon glyphicon-time"></span> Post By <b>${articleData[i].name}</b>`;   
               content.innerHTML=`${articleData[i].content}`;
               time.innerHTML=`${articleData[i].time}`;
              
            
}


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




