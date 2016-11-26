var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('express-session');


//remember to change the password field before deploying
var config ={
  user:'khare19yash',
  database:'khare19yash',
  host:'db.imad.hasura-app.io',
  port: '5432',
  password: process.env.DB_PASSWORD

};

var app = express();
//app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));


/*app.use(express.static(__dirname + '/ui'));

app.set('views', path.join(__dirname, '/ui'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html'); */

function hash (input, salt) {
    // How do we create a hash?
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt, hashed.toString('hex')].join('$');
}

function createTemplate(data){

  var heading = data.heading;
  var date = data.date;
  var content= data.content;
  var author = data.author;


  var htmlTemplate= `
    <!doctype html>
<html>
<head>
  <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link href="/ui/articlestyle.css" rel="stylesheet" />


  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <link rel="stylesheet" href="https://code.getmdl.io/1.2.1/material.deep_purple-blue.min.css" />

  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
  <link href="https://afeld.github.io/emoji-css/emoji.css" rel="stylesheet">



  <script src="https://code.getmdl.io/1.2.1/material.min.js"></script>
  <script type="text/javascript" src="/ui/article.js"></script>




</head>
<body>
  <!-- Always shows a header, even in smaller screens. -->
  <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
   <header class="mdl-layout__header">
    <div class="mdl-layout__header-row">
      <!-- Title -->

      <!-- Add spacer, to align navigation to the right -->
      <div class="mdl-layout-spacer"></div>
      <!-- Navigation. We hide it in small screens. -->
      <nav class="mdl-navigation mdl-typography--body-1-force-preferred-font">
          <a class="mdl-navigation__link" href="/"><h6>Home</h6></a>
          <a class="mdl-navigation__link" href="/login"><h6>Blog</h6></a>
          <a class="mdl-navigation__link" href="/publish-article"><h6>Publish Article</h6></a>
          <a class="mdl-navigation__link" href="/readroom"><h6>Read Room</h6></a>
      </nav>
    </div>
  </header>
  <main class="mdl-layout__content">
    <div class="mdl-grid">
      <div class="mdl-cell mdl-cell--1-col"></div>
      <div class="mdl-cell mdl-cell--5-col">
        <div class="container">
          <h2> ${heading} </h2> <br>
          <p> Written by </p> <a href=""> ${author} </a>  <p> ${date.toDateString()}</p>
          

          <p>${content}</p>

          <h4>Comments</h4>
            <div id="comment_form">
            </div>
            <div id="comments">
              <!--<center>Loading comments...</center> -->
            </div>

         <hr>
       </div>

   </div>
   <div class="mdl-cell mdl-cell--5-col">
     
  </div>
  <div class="mdl-cell mdl-cell--1-col"></div>
</div>

<footer class="mdl-mini-footer">
  <div class="mdl-mini-footer__left-section">
    <div class="mdl-logo">
      <h6>Application developed as part of IMAD </h6>
    </div>
  </div>

  <div class="mdl-mini-footer__right-section">

    <ul class="mdl-mini-footer__link-list">
      <li> <h5><a href="https://www.hackerearth.com/@sumant2" target="_blank"><i class="fa fa-linkedin fa-lg" aria-hidden="true"></i></a></h5></li>

      <li> <h5><a href="https://www.hackerearth.com/@sumant2" target="_blank"><i class="fa fa-header fa-lg"></i></a></h5></li>
      <li><h5><a href="https://github.com/Subway19" target="_blank"><i class="fa fa-github fa-lg"></i></a></h5></li>
      <li>  <h5><a href="https://www.facebook.com/sumantbagade19" target="_blank"><i class="fa fa-facebook fa-lg"></i></a></h5>
      </li>
    </ul>

  </div>
</footer>
</main>
</div>
</body>
</html>

  `

  return htmlTemplate;
}





app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','index.html'));


  
});

var pool = new Pool(config);

app.get('/articles/:articleName', function (req, res) {


  var articleName = req.params.articleName;

  pool.query("SELECT * FROM article WHERE title = $1", [articleName] , function(err,result){
    if(err){
      res.status(500).send(err.toString());
    }
    else{
      if(result.rows.length===0){
        res.status(404).send('Article not found');
      }
      else{
        var articleData = result.rows[0];
        res.send(createTemplate(articleData));
      }
    }

  });

  
});


app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});







app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});


app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});

app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "tanmai", "password": "password"}
   // JSON
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send('User successfully created: ' + username);
      }
   });
});


app.post('/publish-article', function (req, res) {
   // JSON
   // var username = req.body.username;
   // var password = req.body.password;

    var articletitle = req.body.articletitle;
    var articleheading = req.body.articleheading;
    var articledate= req.body.articledate;
    var articleauthor = req.body.articleauthor;
    var articlecontent = req.body.articlecontent;

    if (articletitle == '' || articleheading == '' || articleauthor == '' || articlecontent == '' ) {
        // Inform the user on the screen through some message or give him a alert message
        res.redirect('/publish-article');
        return;
    }
    
    //console.log(articledate);
   pool.query('INSERT INTO article(title, heading, date, content, author) VALUES ($1, $2, $3, $4, $5)', [articletitle, articleheading, articledate, articlecontent, articleauthor], function (err, result) {
      if (err) {
          //res.status(500).send(err.toString());
          res.redirect('/login');
      } else {
          res.send(articletitle +' published successfully.');
      }
    });

   //setTimeout(res.redirect('/login'),5000);
});




app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.redirect('/');
});



app.get('/publish-article', function (req, res) {
     if (req.session && req.session.auth && req.session.auth.userId) {
       res.sendFile(path.join(__dirname,'ui','publish-article.html'));

     }
     else{
      res.send("Login to publish article");
     }
   
});


app.get('/chatroom', function (req, res) {
    res.sendFile(path.join(__dirname,'ui','chatroom.html'));
});

app.get('/readroom', function (req, res) {
    res.sendFile(path.join(__dirname,'ui','readroom.html'));
});


app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname,'ui','login.html'));
});



// serving static files 
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','style.css'));
});


app.get('/ui/aboutstyle.css', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','aboutstyle.css'));
});


app.get('/ui/articlestyle.css', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','articlestyle.css'));
});




app.get('/ui/readroom.css', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','readroom.css'));
});

app.get('/ui/login.css', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','login.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','main.js'));
});


app.get('/ui/readroomscript.js', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','readroomscript.js'));
});

app.get('/ui/login.js', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','login.js'));
});

app.get('/ui/article.js', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','article.js'));
});

app.get('/ui/publish-article.js', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','publish-article.js'));
});



app.get('/ui/readroomjquery.min.js', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','readroomjquery.min.js'));
});


app.get('/ui/against.jpg', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','against.jpg'));
});

app.get('/ui/user.jpg', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','user.jpg'));
});

app.get('/ui/user1.JPG', function (req, res) {
  res.sendFile(path.join(__dirname,'ui','user1.JPG'));
});









var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ` + port );
});
