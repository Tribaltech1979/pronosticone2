/**
 * Created by Daniele on 09/08/2015.
 */

window.addEventListener("resize",function(){
    $("input").css('width',$("img").width()/13+"px");
})

$(document).ready(function () {
    $("[value='null']").val('');
    $("input").css('width',$("img").width()/13+"px");
    $(".alert").hide();

 
    $(".G9").each(function(){if($(this).val() && $(this).val()== 0){$(this).val('X');}})
});


function checkSubmit(){
    $(".alert").hide();
    var good = true;
    $("input").css("background-color","white");
    good = true;
    var count;
    count = 0;

/// colonne totalmente completate
    $(".G1,.G2,.G6,.G9").each(function(){
        if(!$(this).val()){
            $(this).css('background-color','red');
            good = false;
        }
    });
/// colonne completate e con solo numeri
    $(".G1,.G2,.G6").each(function(){
        if(isNaN($(this).val())){
            $(this).css('background-color','red');
            good = false;
        }
    });

    var regex = '[12X]';
    $(".G9").each(function(){
        if(!$(this).val().match(regex)){
            $(this).css('background-color','red');
            good = false;
        }
    });

////// tutto ok si può salvare
    return good;
};

function invia(){
    var arG1, arG2, arG3, arG4, arG5, arG6, arG7, arG8, arG9, arG10, arG11;
 /// RISULTATO ESATTO
    arG1={};
    $(".G1").each(function(){
        arG1[$(this).attr("name").substr(3,6)] = $(this).val();
    });

    arG2={};
    $(".G2").each(function(){
        arG2[$(this).attr("name").substr(3,6)] = $(this).val();
    });
/// TOTALE GOL
    arG6={};
    $(".G6").each(function(){
        arG6[$(this).attr("name").substr(3,6)] = $(this).val();
    });
///SEGNO
    var reg = "[X]";
    arG9={};
    $(".G9").each(function(){
        if($(this).val().match(reg)){
            arG9[$(this).attr("name").substr(3, 6)]  = 0;
        }
        else {
            arG9[$(this).attr("name").substr(3, 6)] = $(this).val();
        }
    });
///SQUADRA ESATTA
    arG12={};
    $(".GC").each(function(){
       arG12[$(this).attr("name").substr(3,6)] = $(this).val();
    });
    arG13={};
    $(".GC").each(function(){
       arG13[$(this).attr("name").substr(3,6)] = $(this).val();
    });
    
    var SarG1 = JSON.stringify(arG1);
    var SarG2 = JSON.stringify(arG2);
    //var SarG3 = JSON.stringify(arG3);
    //var SarG4 = JSON.stringify(arG4);
    //var SarG5 = JSON.stringify(arG5);
    var SarG6 = JSON.stringify(arG6);
    //var SarG7 = JSON.stringify(arG7);
    //var SarG8 = JSON.stringify(arG8);
    var SarG9 = JSON.stringify(arG9);
    //var SarG10 = JSON.stringify(arG10);
    //var SarG11 = JSON.stringify(arG11);
    var SarG12 = JSON.stringify(arG12);
    var SarG13 = JSON.stringify(arG13);

    $.post("/salvapron3",{
            torneo : $("input").filter("[name='torneo']").val(),
            giorn : $("input").filter("[name='giorn']").val(),
            tab1 : SarG1,
            tab2 : SarG2,
            tab6 : SarG6,
            tab9 : SarG9,
            tab12 : SarG12,
            tab13 : SarG13
    },
    function(data,status){
        if(status=='success'){
            $(".alert-success").show();
        }
        else{
            $(".alert-warning").show();
        }

    });
}

function validate() {
    if (checkSubmit()) {
       // document.getElementById("compila").submit();
        invia();
    }
    else {
        $(".alert-danger").show();
    }
}