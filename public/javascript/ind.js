/**
 * Created by schiappacassed on 15/10/2015.
 */
var currentBackground = 0;
var backgrounds = [];
backgrounds[0] = './img/rovesciata.png';
backgrounds[1] = './img/Worldcup.png';
backgrounds[2] = './img/Champions.png';
backgrounds[3] = './img/pallone2.jpg';


function changeBackground() {
    currentBackground++;
    if(currentBackground > 3) currentBackground = 0;

    $("#prova").fadeOut(1000,function() {
        $("body").css({
            'background-image' : "url('" + backgrounds[currentBackground] + "')"
        });
        $("#prova").fadeIn(1000);
    });


    setTimeout(changeBackground, 8000);
}

$(document).ready(function() {
    $("body").css({'background-repeat': "no-repeat"});
    $("body").css({'background-position': "center"});

    setTimeout(changeBackground, 1000);

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '1029924330389757',
            xfbml      : true,
            version    : 'v2.6'
        });
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

});

function fblogin(){
    FB.getLoginStatus(function(response){
        if(response.status == 'connected'){
            FB.api('/me',function(response){

                var profile = JSON.stringify(reponse);
                $.post('/fblogin',{
                    profilo : profile
                });
            });

        }else{
            FB.login();
        }
    });
};


function gplogin(){

};

function checkSubmit(){
    $(".alert").hide();
    var good = true;
    $("input").css("background-color","white");
    good = true;

    $(".G1,.G2").each(function(){
        if(!$(this).val()){
            $(this).css('background-color','red');
            good = false;
        }
    });


    return good;
}

function login(){

    if(checkSubmit()){
        $.post('/login',{
            username : $(".G1").val(),
            password : $(".G2").val()

        });

    }


}