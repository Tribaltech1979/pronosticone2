/**
 * Created by schiappacassed on 03/06/2016.
 */


$(document).ready(function () {
    $(".alert").hide();

});


function checkSubmit(){
    $(".alert").hide();
    var good = true;
    $("input").css("background-color","white");
    good = true;

    $(".G1,.G2,.G3,.G4").each(function(){
        if(!$(this).val()){
            $(this).css('background-color','red');
            good = false;
        }
    });

    if($(".G2").val() != $(".G3").val()){
        $(".G2,.G3").css('background-color','red');
    }


    return good;
}


function valida(){
    if (checkSubmit()){
        var sq = $(".G1").val();
        var pass = $(".G2").val();
        var image = null;
        var mail = $(".G4").val();
        var checkb = '';
        if($(".G5").is(':checked')){
            checkb = 'X';
        }
        $.post('/signin',{
            squadra :sq,
            image : image,
            email : mail,
            chk : checkb,
            password : pass
        });
    }
}