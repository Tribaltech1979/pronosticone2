/**
 * Created by Schiappacassed on 19/09/2015.
 */
$(document).ready(function () {
    $(".alert").hide();

});


function checkSubmit(){
    $(".alert").hide();
    var good = true;
    $("input").css("background-color","white");
    good = true;

    $(".G1,.G3").each(function(){
        if(!$(this).val()){
            $(this).css('background-color','red');
            good = false;
        }
    });


    return good;
}


function valida(){
    if (checkSubmit()){
        var sq = $(".G1").val();
        var image = null;
        var mail = $(".G3").val();
        var checkb = '';
        if($(".G4").is(':checked')){
            checkb = 'X';
        }
        $.post('/newsq',{
           squadra :sq,
           image : image,
           email : mail,
           chk : checkb
        });
    }
}