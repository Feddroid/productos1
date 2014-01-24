$(document).on('pageinit', '#home', function(){      

    var quer =  "SELECT * FROM html WHERE url ='http://lalujuria.pe/productos.html'";
        quer += " and xpath='//div[@id=\"contenedor_productos\"]'";

    //var yql_query = "select * from html where url='" + news_url + story + "'";      
      //  yql_query += " and xpatgith='//div[@id=\"content\"]'";  
    
        var url = "http://query.yahooapis.com/v1/public/yql?q=" + 
                  encodeURIComponent(quer) + "&format=json";
        //console.log(url);

    $.ajax({
        type:"GET",
        url: url ,
        crossDomain:true,
        dataType: "jsonp",
        async: true,
        success: function (result) {
            ajax.parseJSONP(result);
            //console.log(result.query);
        },
        error: function (request,error) {
            alert('Network error has occurred please try again! Maik');
        }
    });  

});

$(document).on('pagebeforeshow', '#headline', function(){  
    var movieData = $('#movie-data');
        movieData.empty();
    $.each(movieInfo.result, function(i, row) {
        if(row.id == movieInfo.id) {
            console.log(row.poster_path+" Hola1");
            movieData.append('<li><img src="http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w185'+row.poster_path+'"></li>');
            movieData.append('<li>Title: '+row.original_title+'</li>');
            movieData.append('<li>Release date'+row.release_date+'</li>');
            movieData.append('<li>Popularity : '+row.popularity+'</li>');   
            movieData.append('<li>Popularity : '+row.vote_average+'</li>');             
            movieData.listview('refresh');            
        }
    });    
});

$(document).on('vclick', '#movie-list li a', function(){  
    movieInfo.id = $(this).attr('data-id');
    $.mobile.changePage( "#headline", { transition: "slide", changeHash: false });
});

var movieInfo = {
    id : null,
    result : null
}

var ajax = {  
    parseJSONP:function(result){  
        movieInfo.result = result.query.results;
        console.log(movieInfo.result);
       // $.each(result.query, function(i, row) {
            //console.log(JSON.stringify(row));
             //console.log(row.poster_path+" Hola").
          //console.log(JSON.stringify(row));
            //$('#movie-list').append('<li><a href="" data-id="' + row.id + '"><img src="http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w185'+row.poster_path+'"/><h3>' + row.title + '</h3><p>' + row.vote_average + '/10</p></a></li>');
       // });
        $('#movie-list').listview('refresh');
    }
}