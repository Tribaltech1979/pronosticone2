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
});