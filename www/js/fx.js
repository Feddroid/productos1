$(document).on('pageinit', '#home', function(){      
    var quer =  "SELECT * FROM html WHERE url ='http://lalujuria.pe/productos.html'";
        quer += " and xpath='//div[@id=\"contenedor_productos\"]//ul//li//div'";

        //quer += " and xpath='//div[@id=\"contenedor_productos\"]//ul//li//div//a//img'";
    //var yql_query = "select * from html where url='" + news_url + story + "'";      
      //  yql_query += " and xpath='//div[@class=\"content\"]//div[@class=\"txt\"]/p'";    
    
        var url = "http://query.yahooapis.com/v1/public/yql?q=" + 
                  encodeURIComponent(quer) + "&format=json&diagnostics=true";

    $.ajax({
        url: url ,
        crossDomain:true,
        dataType: "jsonp",
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
        if(row.a.id == movieInfo.id) {
            movieData.append('<li><img src="http://lalujuria.pe/'+row.a.img.src+'"></li>');
            movieData.append('<li>'+row.p+'</li>');
            movieData.append('<li><a href="" data-ids="'+row.a.id+'" id="pedidos">Hacer un pedido</a></li>');      
            movieData.listview('refresh');           
        }
    });    
});

$(document).on('pagebeforeshow', '#pedido', function(){  
    var movieData = $('#movie-data-pedido');
        movieData.empty();
    $.each(movieInfo.result, function(i, row) {
        if(row.a.id == movieInfo.id) {
            movieData.append('<li><img src="http://lalujuria.pe/'+row.a.img.src+'"></li>');
            movieData.append('<li id="nom-producto">'+row.p+'</li>');    
            movieData.append('<li style="display:none;"><input type="text" id="producto" name="producto" value="'+row.p+'" /></li>');    
            movieData.append('<li id="texto-cajas"><input type="text" id="cantidad" name="cantidad" placeholder="Cantidad" class="ui-body-c ui-corner-all ui-shadow-inset ui-mini" value=""/><input type="text" id="cliente" name="cliente"  placeholder="Nombre" class="ui-body-c ui-corner-all ui-shadow-inset ui-mini" value=""/><input type="email" id="email" name="email"  placeholder="Email" class="ui-body-c ui-corner-all ui-shadow-inset ui-mini" value=""/></li>');   
            movieData.append('<li><input type="submit" class="ui-btn" id="btn-enviar" value="Enviar"></li>');   
            movieData.listview('refresh');           
        }
    });    
});

$(document).on('vclick', '#movie-list li a', function(){  
    movieInfo.id = $(this).attr('data-id');
    $.mobile.changePage( "#headline", { transition: "slide", changeHash: false });
});

$(document).on('vclick', '#pedidos', function(){  
    movieInfo.id = $(this).attr('data-ids');
    $.mobile.changePage( "#pedido", { transition: "slide", changeHash: false });
});

function envioS() {
    $.mobile.changePage( "#home", { transition: "slide", changeHash: false });
}

function envioN() {
    $.mobile.changePage( "#home", { transition: "slide", changeHash: false });
}

function showSpinner(){
    $.mobile.loading("show");
}

function hideSpinner(){
    $.mobile.loading("hide");
}

$(document).on('submit', 'form', function(){
    var postData = $(this).serialize();
    var postCant = $('#cantidad').val();
    var postCliente = $('#cliente').val();
    var postEmail = $('#email').val();

    var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;

    if(postCant === "" || postCant === null){
        navigator.notification.alert('Por favor ingresar una cantidad',null,'*Campo obligatorio','Ok');
    }else if(postCliente === "" || postCliente === null){
        navigator.notification.alert('Por favor ingresar un nombre',null,'*Campo obligatorio','Ok');
    }else if(postEmail === "" || !emailreg.test($("#email").val()) ){
        navigator.notification.alert('Por favor ingresar un email',null,'*Campo obligatorio','Ok');
    }else{
        showSpinner();
        $.ajax({
                url: 'http://roinet.pe/dispositivos/pedidos/envio/db.php',
                type: 'POST',
                data: postData,
                crossDomain:true,
                dataType: 'text',
                async: true,
                success: function(result){
                    navigator.notification.alert("Su pedido fue realizado con exito. Nos comunicaremos en breve con usted.",envioS,"Mensaje Enviado","Ok");
                    hideSpinner();
                },
                error: function(result){
                    navigator.notification.alert("Hubo un error. Por favor intentelo nuevamente.",envioN,"Error","Ok");
                    hideSpinner();
                }    
        });
    }
    return false;
});

var movieInfo = {
    id : null,
    result : null
}

var ajax = {  
    parseJSONP:function(result){  
      movieInfo.result = result.query.results.div;
      $.each(movieInfo.result, function(i, row) {
        $('#movie-list').append('<li><a href="" data-id="' + row.a.id + '"><img src="http://lalujuria.pe/'+row.a.img.src+'"/><h3>' + row.p + '</h3></a></li>');
        $('#cargando').hide();
      });
      $('#movie-list').listview('refresh');

    }
}