var express = require('express');
var app = express();
var morgan = require('morgan');
app.use(morgan('combined'));

var http = require('http').Server(app);


var path = require('path');
var Pool = require('pg').Pool;




//DATABASE CONFIGURATION
var config = {
  host: 'db.imad.hasura-app.io',
  user: 'khare19yash',
  password: process.env.DB_PASSWORD,
  database: 'khare19yash',
  port:'5432'
};

//INDEX PAGE
app.get('/', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

//CONNECTION CREATION
var pool=new Pool(config);
app.get('/test-db', function (req, res) {
    pool.query('select * from articles',function(err,result){
        if(err)
        {
          res.status(500).send(err.toString()) ;
        }
        else
        {
          res.send(JSON.stringify(result.rows));  
        }
    });
 
});

//load blog
app.get('/blog', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'blog.html'));
});

//BOOTSTRAP FILES INCLUDES
app.get('/ui/css/bootstrap.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/css', 'bootstrap.min.css'));  //bootstrap  to test
});

app.get('/ui/css/bootstrap.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/css', 'bootstrap.css'));  //bootstrap
});

app.get('/ui/js/bootstrap.min.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/js', 'bootstrap.min.js'));  //bootstrap
});
//main.js
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
//article.js
app.get('/ui/article.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article.js'));
});
//favicon
app.get('/fevicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'favicon.ico'));
});
//style
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});


//images
app.get('/ui/images/spinner.gif', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'spinner.gif'));
});

app.get('/ui/images/inayat.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'inayat.jpg'));
});

app.get('/ui/images/saviours.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'saviours.png'));
});
app.get('/ui/images/server.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'server.png'));
});
app.get('/ui/images/phone.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'phone.png'));
});
app.get('/ui/images/mail.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'mail.png'));
});
app.get('/ui/images/iitm.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'iitm.png'));
});
app.get('/ui/images/web.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'web.png'));
});
app.get('/ui/images/java.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'java.png'));
});
app.get('/ui/images/setting.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'setting.png'));
});
app.get('/ui/images/school.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'school.png'));
});
app.get('/ui/images/college.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'college.png'));
});
app.get('/ui/images/fb.PNG', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'fb.PNG'));
});
app.get('/ui/images/gp.PNG', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'gp.PNG'));
});
app.get('/ui/images/lkn.PNG', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'lkn.PNG'));
});
app.get('/ui/images/twitter.PNG', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui/images', 'twitter.PNG'));
});

app.get('/ui/images/a.gif',function(req,res){
res.sendFile(path.join(__dirname, 'ui/images' , 'a.gif'));
});
app.get('/ui/images/fb.jpg',function(req,res){
res.sendFile(path.join(__dirname, 'ui/images' , 'fb.jpg'));
});
app.get('/ui/images/gl.jpg',function(req,res){
res.sendFile(path.join(__dirname, 'ui/images' , 'gl.jpg'));
});


/*

//app.get('/blog', function (req, res) {
app.get('/articles/:articleName', function (req, res) {
// var articleName=req.params.articleName;
//pool.query("Select * from articles,users where title='" + req.params.articleName + "'", function(err,result){
pool.query("select article_tags.tag,articles.title,articles.content,articles.category,articles.heading, articles,date,users.name from articles,article_tags,users where article_tags.article_id=articles.id AND articles.title='"+ req.params.articleName +"' AND articles.author_id=users.id  order by time DESC",function(err,result){
    

    
    
    if(err){
          res.status(500).send(err.toString()) ;
          }
     else{
            if(result.rows.length===0)
             {
                res.status(400).send('ARTICLE NOT FOUND');
             }
                 else{
                
                 res.send(JSON.stringify(result.rows));
                     
                 }
             }
    
});
});
 

*/


//getting categories
app.get('/get-categories', function (req, res) {
   pool.query('SELECT * FROM category', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});




//fetching recent article on blog home page
app.get('/get-blog-data',function(req,res){
    pool.query("select articles.title,articles.content,articles.category,articles.heading, articles.time,users.name from articles,article_tags,users where articles.author_id=users.id order by time DESC",function(err,result){
         if(err){
          res.status(500).send(err.toString()) ;
          }
     else{
            if(result.rows.length===0)
             {
                res.status(400).send('ARTICLE NOT FOUND');
             }
                 else{
                   res.send(JSON.stringify(result.rows));
                     
                 }
             }
        
    });
    
});

//get-tags

 



var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
 console.log(`IMAD course app listening on port ${port}!`);
});
