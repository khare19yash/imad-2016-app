


var $categoryElem = $('#categories-element');

//var $body = $('body');

//var $nytHeaderElem = $('#nytimes-header');
//var $nytElem = $('#nytimes-articles');
//var $greeting = $('#greeting');
//var $wikiElem = $('#wikipedia-links');




function loadData() {
    // clear out old data before new request
    $categoryElem.text("");
    //$nytElem.text("");
    var nytimesURL = 'https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=2b71d13814a34d95bb84259dd603f4ff';
    /*$.getJSON( nytimesURL, function( data ) {


      var categories = data.results;

       //console.log(categories);
       var category;

       for(var i=0; i <categories.length;i++){
        //console.log(categories[i].list_name);
        //category = categories[i].list_name_encoded;
        
        $('#categories-element').append(
           //'<li>'+ categories[i].display_name +'</li>'
           `<li class="mdl-list__item">
              <span class="mdl-list__item-primary-content">`+
                categories[i].list_name +
              `</span>
            </li><hr>`
        )
        
    }


}).error(function(e){
    $categoryElem.text("Couldn't load");



  }); */



  $.ajax({
    url : nytimesURL,
    method:'get',
    data: {},
    dataType : 'json',
    success : function(data){


      var categories = data.results;

       //console.log(categories);
       var category;



       for(var i=0; i <categories.length;i++){
        //console.log(categories[i].list_name);
        //category = categories[i].list_name_encoded;
        
        $('#categories-element').append(
           //'<li>'+ categories[i].display_name +'</li>'
           `<li class="mdl-list__item">
           <span class="mdl-list__item-primary-content">`+
           categories[i].list_name +
           `</span>
           </li><hr>`
           )}

    }


  }); 



//return false;
}





function loadBooks() {

  var requestBooks = $('#books').val();
  console.log(requestBooks);
  var requestTimeout = setTimeout(function(){
    $('#books-links').append('<p>Couldnt find the books. Please input valid Category name by referring from the Categories List on Left Hand Side.</p>');

  },6000 );


  var booksURL = 'https://api.nytimes.com/svc/books/v3/lists/overview.json?api-key=2b71d13814a34d95bb84259dd603f4ff';


  $.ajax({
    url : booksURL,
    method:'get',
    data: {},
    dataType : 'json',
    success : function(data){

        //console.log(data.results.lists[0]);

        //var booklist = data.results.lists[0];
        //console.log(booklist.books);

        //$wikiElem.append('<i> id:'+ booklist.display_name +'</i>' + '<p>'+booklist.updated+'</p>');

        //var booklist2 = booklist.books;
        var booklist;

        for(var j=0;j<=data.results.lists.length;j++)
        {
            //console.log(data.results.lists[j].list_name);
            if(data.results.lists[j].list_name == requestBooks)
            {
              console.log(true);
              booklist = data.results.lists[j].books;
                //console.log(booklist);
                $('#books-links').append('<h5> Books for the category:'+ data.results.lists[j].display_name +'</h5>' + '<h5> Updated:'+data.results.lists[j].updated+'</h5>');
                //var booklist2 = booklist.books
                //console.log(booklist2);
                $.each(booklist,function(i,item){

          //console.log(item);


          html2 += 

          `<div class="mdl-grid mdl-cell mdl-cell--12-col mdl-cell--4-col-tablet mdl-card mdl-shadow--4dp">
          <div class="mdl-card__media mdl-cell mdl-cell--12-col-tablet">
          <img class="article-image" id="user-image" src="` + item.book_image + `" border="0" alt="">
          </div>
          <div class="mdl-cell mdl-cell--8-col">
          <h4>`+ item.title + `</h4>
          <h4 class="mdl-card__title-text"> <i> by ` +item.author + `</i> </h4>
          <div class="mdl-card__supporting-text padding-top">

          </div>
          <div class="mdl-card__supporting-text no-left-padding">
          <p> ` + item.description +` 
          </p>
          <p>Rank: ` + item.rank +` 
          </p>
          <p>Weeks on List: ` + item.weeks_on_list +` 
          </p>
          <a href=`+ item.book_review_link +`><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
          Read Review
          </button></a>
          <a href=`+ item.amazon_product_url +`><button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
          Buy on Amazon
          </button> </a>



          </div>
          </div>
          </div>`;




            //$('#wikipedia-links').html(html2);
            $('#books-links').append(html2);
            clearTimeout(requestTimeout);

          });
              }
              else
              {
                console.log(false);
              }
            }

        //console.log(booklist2);
        var html2 = "";
        

        //clearTimeout(requestTimeout);

      }

    }); 


}



$('#books').keypress(function(event){
  var keycode = (event.keyCode ? event.keyCode : event.which);
  if(keycode == '13'){
   loadBooks(); 
 }
        //Stop the event from propogation to other handlers
        //If this line will be removed, then keypress event handler attached 
        //at document level will also be triggered
        event.stopPropagation();
      });

