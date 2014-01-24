$(document).on('pageinit', '#home', function(){      

    var quer =  "SELECT * FROM html WHERE url ='http://lalujuria.pe/productos.html'";
        quer += " and xpath='//div[@id=\"contenedor_productos\"]//ul//li//div'";

        //quer += " and xpath='//div[@id=\"contenedor_productos\"]//ul//li//div//a//img'";
    //var yql_query = "select * from html where url='" + news_url + story + "'";      
      //  yql_query += " and xpath='//div[@class=\"content\"]//div[@class=\"txt\"]/p'";    
    
        var url = "http://query.yahooapis.com/v1/public/yql?q=" + 
                  encodeURIComponent(quer) + "&format=json&diagnostics=true";
        //console.log(url);

    $.ajax({
        url: url ,
        crossDomain:true,
        dataType: "json",
        async: true,
        success: function (result) {
            ajax.parseJSONP(result);
        },
        error: function (request,error) {

            alert('Network error has occurred please try again!');
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

        movieInfo.result = result.query.results.div;
        objJSON = eval("(function(){return " + JSON.stringify(movieInfo.result) + ";})()");
        // console.log(JSON.stringify(objJSON[0]["class"])+" dhihsid" );
        //console.log("UNOO "+movieInfo.result);
        //console.log("DOS "+JSON.stringify(movieInfo.result));

      $.each(movieInfo.result, function(i, row) {
            //console.log("DOS "+JSON.stringify(row.p)+" TRES "+JSON.stringify(row.a.img.src));
            $('#movie-list').append('<li><a href="" data-id=""><img src="http://lalujuria.pe/'+row.a.img.src+'"/><h3>' + row.p + '</h3></a></li>');
      });
        $('#movie-list').listview('refresh');
    }
}