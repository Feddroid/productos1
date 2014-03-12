$(document).on('pageinit', '#home-principal', function(){ 
    $('#cargando').hide();
});

$(document).on('pagebeforeshow', '#home', function(){      
    var movieData = $('#movie-list');
        movieData.empty();

    var quer =  "SELECT * FROM html WHERE url ='http://lalujuria.pe/productos.html'";
        quer += " and xpath='//div[@id=\"contenedor_productos\"]//ul//li//div'";
    
        var url = "http://query.yahooapis.com/v1/public/yql?q=" + 
                  encodeURIComponent(quer) + "&format=json&diagnostics=true";

   $('#cargando').show();

    $.ajax({
        url: url ,
        crossDomain:true,
        dataType: "jsonp",
        async: true,
        success: function (result) {
            ajax.parseJSONP(result);
        },
        error: function (request,error) {
            navigator.notification.alert("Por favor verifique su acceso a internet.",null,"Error de conexión","Ok");
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
            movieData.append('<li><a href="" data-ids="'+row.a.id+'" data-cat="'+row.id+'" id="pedidos">Hacer un pedido</a></li>');      
            movieData.listview('refresh');           
        }
    });    
});

$(document).on('vclick', '#plus', function(){  
    var value = $('#cantidad').val();
        value++; 
        console.log("es MAS");
       
         $('#cantidad').val(value);
});

$(document).on('vclick', '#minus', function(){  
     var value = $('#cantidad').val();
        value--;
         if("1" <= value){
            $('#cantidad').val(value);
             console.log("es MAYOR");
        }else{
             $('#cantidad').val("1");
             console.log("es menor");
        }
});

$(document).on('pagebeforeshow', '#pedido', function(){  
    var movieData = $('#movie-data-pedido');
        movieData.empty();
    $.each(movieInfo.result, function(i, row) {
        var rowID = row.id;
        //barras bombones cremavellanas tortas
        if (rowID === "barras"){
            rowID = "barra(s)";
        }else if (rowID === "bombones"){
            rowID = "caja(s)";
        }else if (rowID === "cremavellanas"){
            rowID = "frasco(s)";
        }else{
            rowID = "torta(s)";
        }

        if(row.a.id == movieInfo.id) {
            movieData.append('<li><img src="http://lalujuria.pe/'+row.a.img.src+'"></li>');
            movieData.append('<li id="nom-producto">'+row.p+'</li>');    
            movieData.append('<li style="display:none;"><input type="text" id="producto" name="producto" value="'+row.p+'" /> <input type="text" id="presentacion" name="presentacion" value="'+rowID+'" /></li>');    
            movieData.append('<li id="texto-cajas"><label id="cantidad-label">Cantidad de '+rowID+':</label><div data-role="controlgroup" data-mini="true"><input type="button" class="ui-btn" id="plus" value="+"/><input type="text" id="cantidad" name="cantidad" value="1" min="1" max="200" readonly /><input type="button" class="ui-btn" id="minus" value="-"/></div><input type="text" id="cliente" name="cliente" placeholder="Nombre" class="ui-body-c ui-corner-all ui-shadow-inset ui-mini" value=""/><input type="email" id="email" name="email"  placeholder="Email" class="ui-body-c ui-corner-all ui-shadow-inset ui-mini" value=""/></li>');   
            movieData.append('<li><input type="submit" class="ui-btn" id="btn-enviar" value="Enviar"></li>');   
            movieData.listview('refresh');           
        }
    });    
});

$(document).on('vclick', '#home-principal .ui-content .ui-body', function(){  
    movieInfo.id = $(this).attr('id');
    console.log(movieInfo.id+" aaa1");
    $('#cargando').show();
    $.mobile.changePage( "#home", { transition: "slide", changeHash: false });
});

$(document).on('vclick', '#movie-list li a', function(){  
    movieInfo.id = $(this).attr('data-id');
    movieInfo.id2 = $(this).attr('data-cat');
    console.log(movieInfo.id+" aaa2.1 "+movieInfo.id2+" aaa2.2");
    $.mobile.changePage( "#headline", { transition: "slide", changeHash: false });
});

$(document).on('vclick', '#pedidos', function(){  
    movieInfo.id = $(this).attr('data-ids');
    movieInfo.id2 = $(this).attr('data-cat');
    console.log(movieInfo.id+" aaa3.1 "+movieInfo.id2+" aaa3.2");
    //console.log(movieInfo.id+" aaa3");
    $.mobile.changePage( "#pedido", { transition: "slide", changeHash: false });
});

function envioS() {
    $.mobile.changePage( "#home-principal", { transition: "slide", changeHash: false });
}

function envioN() {
    $.mobile.changePage( "#home-principal", { transition: "slide", changeHash: false });
}

function showSpinner(){
    //$.mobile.loading("show");
     movieInfo.id2 = "";
    $('#cargando').show();
}

function hideSpinner(){
    //$.mobile.loading("hide");
    $('#cargando').hide();
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
                    //envioS();
                    console.log("Esto es"+postData);
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
      //console.log( movieInfo.id+" PASoAJax "+movieInfo.id2);
      $.each(movieInfo.result, function(i, row) {
        //console.log("DOS "+JSON.stringify(row.id));
        if (row.id === movieInfo.id || row.id === movieInfo.id2) { //barras bombones cremavellanas tortas
            $('#movie-list').append('<li><a href="" data-id="' + row.a.id + '" data-cat="'+row.id+'"><img src="http://lalujuria.pe/'+row.a.img.src+'"/><h3>' + row.p + '</h3></a></li>');
            $('#cargando').hide();
        };
      });
      $('#movie-list').listview('refresh');
      movieInfo.id2 = "";
    }
}