/**
 * Created by schiappacassed on 03/06/2016.
 */


$(document).ready(function () {
    $(".alert").hide();

});

var user ;
var mail ;

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
    
    

    $.post('/checkuser',{
        username : $(".G1").val()
    },function(data){
       // var result = JSON.parse(data);
        user = data;
        console.log("risposta  "+data.stato);
        if (data.stato = 'success'){
            $(".G1").css('background-color','green');
        }
        else{
            $(".G1").css('background-color','red');
            good = false;
        }
    });


    $.post('/checkmail',{
        mail : $(".G4").val()
    },function(data){
       // var result = JSON.parse(data);
        mail = data ;
        if (data.stato = 'success'){
            $(".G4").css('background-color','green');
        }
        else{
            $(".G4").css('background-color','red');
            good = false;
        }
    });


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
    //    $.post('/signin',{
      //      squadra :sq,
        //    image : image,
          //  email : mail,
            //chk : checkb,
            //password : pass
        //});
        $("form").submit();
    }
}