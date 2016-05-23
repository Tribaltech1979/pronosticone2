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

 
    $(".G9,.G10").each(function(){if($(this).val() && $(this).val()== 0){$(this).val('X');}})
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

////////////// DOPPIE
    //// RISULTATO ESATTO
    $(".G3").each(function(){
        if($(this).val()){
            count = count +1;
            ////solo una doppia
            if(count > 1){
                $(this).css('background-color','red');
                good = false;
            }
            ///deve essere un numero
            if(isNaN($(this).val())){
                $(this).css('background-color','red');
                good = false;
            }
            ///deve essere accoppiata all'altra cella
            if(!$(this).parents("tr").find(".G4").val() || isNaN($(this).parents("tr").find(".G4").val())){
                $(this).parents("tr").find(".G4").css('background-color','red');
                good = false;
            }

        }
    });
    if (count == 0){
        ///se nessuna è valorizzata va in errore
        $(".G3,.G4").css('background-color','red');
        good = false;
    }
    ///////SOMMA GOL
    count = 0;
    $(".G7").each(function(){
        if($(this).val()) {
            count = count + 1;
            ////solo una doppia
            if (count > 1) {
                $(this).css('background-color', 'red');
                good = false;
            }
            ///deve essere un numero
            if (isNaN($(this).val())) {
                $(this).css('background-color', 'red');
                good = false;
            }
        }

    });
    if (count == 0){
        ///se nessuna è valorizzata va in errore
        $(".G7").css('background-color','red');
        good = false;
    }

    count = 0;
    ///// SEGNO
    $(".G10").each(function(){
        if($(this).val()) {
            count = count + 1;
            ////solo una doppia
            if (count > 1) {
                $(this).css('background-color', 'red');
                good = false;
            }
            ///deve essere un segno
            if (!$(this).val().match(regex)) {
                $(this).css('background-color', 'red');
                good = false;
            }
        }

    });
    if (count == 0){
        ///se nessuna è valorizzata va in errore
        $(".G10").css('background-color','red');
        good = false;
    }
///// JOLLY
    var regex2 = '[*]';
    count = 0;
    ///// RISULTATO ESATTO
    $(".G5").each(function() {
        if ($(this).val()) {
            count = count + 1;
            ////solo un jolly
            if (count > 1) {
                $(this).css('background-color', 'red');
                good = false;
            }
            ///deve essere un segno
            if (!$(this).val().match(regex2)) {
                $(this).css('background-color', 'red');
                good = false;
            }
            /// non si gioca il jolly sulla doppia
            if ($(this).parents("tr").find(".G3").val()) {
                $(this).css('background-color', 'red');
                good = false;
            }
        }
    });
        if (count == 0){
            ///se nessuna è valorizzata va in errore
            $(".G5").css('background-color','red');
            good = false;
        }
        count = 0;
        ///// NUMERO GOL
        $(".G8").each(function() {
            if ($(this).val()) {
                count = count + 1;
                ////solo un jolly
                if (count > 1) {
                    $(this).css('background-color', 'red');
                    good = false;
                }
                ///deve essere un segno
                if (!$(this).val().match(regex2)) {
                    $(this).css('background-color', 'red');
                    good = false;
                }
                /// non si gioca il jolly sulla doppia
                if ($(this).parents("tr").find(".G7").val()) {
                    $(this).css('background-color', 'red');
                    good = false;
                }
            }
        });

    if (count == 0){
        ///se nessuna è valorizzata va in errore
        $(".G8").css('background-color','red');
        good = false;
    }
        count = 0;
        ///// SEGNO
        $(".G11").each(function(){
            if($(this).val()) {
                count = count + 1;
                ////solo un jolly
                if (count > 1) {
                    $(this).css('background-color', 'red');
                    good = false;
                }
                ///deve essere un segno
                if (!$(this).val().match(regex2)) {
                    $(this).css('background-color', 'red');
                    good = false;
                }
                /// non si gioca il jolly sulla doppia
                if($(this).parents("tr").find(".G10").val()){
                    $(this).css('background-color', 'red');
                    good = false;
                }
            }

        });
        if (count == 0){
            ///se nessuna è valorizzata va in errore
            $(".G11").css('background-color','red');
            good = false;
        }



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
/// DOPPIE
    arG3={};
    $(".G3").each(function(){
        if ($(this).val()) {
            arG3[$(this).attr("name").substr(3, 6)] = $(this).val();
        }
        else {
            arG3[$(this).attr("name").substr(3, 6)] = 'null';
        }
    });

    arG4={};
    $(".G4").each(function(){
        if ($(this).val()) {
            arG4[$(this).attr("name").substr(3, 6)] = $(this).val();
        }
        else {
            arG4[$(this).attr("name").substr(3, 6)] = 'null';
        }
    });
// JOLLY
    arG5={};
    $(".G5").each(function(){
        if ($(this).val()) {
            arG5[$(this).attr("name").substr(3, 6)] = "'" + $(this).val() + "'";
        }
        else{
            arG5[$(this).attr("name").substr(3,6)] = 'null';
        }
    });
/// TOTALE GOL
    arG6={};
    $(".G6").each(function(){
        arG6[$(this).attr("name").substr(3,6)] = $(this).val();
    });
// DOPPIA
    arG7={};
    $(".G7").each(function(){
        if($(this).val()) {
            arG7[$(this).attr("name").substr(3, 6)] = $(this).val();
        }
        else{
            arG7[$(this).attr("name").substr(3, 6)] ='null';
        }
    });
/// JOLLY
    arG8={};
    $(".G8").each(function(){
        if ($(this).val()) {
            arG8[$(this).attr("name").substr(3, 6)] = "'" + $(this).val() + "'";
        }
        else{
            arG8[$(this).attr("name").substr(3,6)] = 'null';
        }
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
//DOPPIA
    arG10={};
    $(".G10").each(function(){
        if(!$(this).val()){
            arG10[$(this).attr("name").substr(4, 6)] = 'null';
        }
        else {
            if($(this).val().match(reg)){
                arG10[$(this).attr("name").substr(4, 6)]  = 0;
            }
            else{
                arG10[$(this).attr("name").substr(4, 6)] = $(this).val();
            }
        }

    });

    //// JOLLY
    arG11={};
    $(".G11").each(function(){
        if ($(this).val()){
            arG11[$(this).attr("name").substr(4,6)] = "'"+$(this).val()+"'";
        }
        else{
            arG11[$(this).attr("name").substr(4,6)] = 'null';
        }
    });

    var SarG1 = JSON.stringify(arG1);
    var SarG2 = JSON.stringify(arG2);
    var SarG3 = JSON.stringify(arG3);
    var SarG4 = JSON.stringify(arG4);
    var SarG5 = JSON.stringify(arG5);
    var SarG6 = JSON.stringify(arG6);
    var SarG7 = JSON.stringify(arG7);
    var SarG8 = JSON.stringify(arG8);
    var SarG9 = JSON.stringify(arG9);
    var SarG10 = JSON.stringify(arG10);
    var SarG11 = JSON.stringify(arG11);

    $.post("/salvapron",{
            torneo : $("input").filter("[name='torneo']").val(),
            giorn : $("input").filter("[name='giorn']").val(),
            tab1 : SarG1,
            tab2 : SarG2,
            tab3 : SarG3,
            tab4 : SarG4,
            tab5 : SarG5,
            tab6 : SarG6,
            tab7 : SarG7,
            tab8 : SarG8,
            tab9 : SarG9,
            tab10 : SarG10,
            tab11 : SarG11
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