/**
 * Created by Daniele on 29/08/2015.
 */

$(document).ready(function () {
    $("[value='null']").val('');
    $("input").css('width',$("img").width()/13+"px")
    $(".alert").hide();


    $(".G3").each(function(){if($(this).val() && $(this).val()== 0){$(this).val('X');}})
});
function checkSubmit() {
    $(".alert").hide();
    var good = true;
    $("input").css("background-color", "white");
    good = true;

    $(".G1,.G2").each(function(){
        if($(this).val()) {
            if (isNaN($(this).val())) {
                $(this).css('background-color', 'red');
                good = false;
            }
        }
    });

    $(".G1").each(function(){
        if($(this).val()) {
            if ($(this).val() > $(this).parents("tr").find(".G2").val()) {
                $(this).parents("tr").find(".G3").val(1);
            }
            else if ($(this).val() < $(this).parents("tr").find(".G2").val()) {
                $(this).parents("tr").find(".G3").val(2);
            }
            else if ($(this).val() == $(this).parents("tr").find(".G2").val()) {
                $(this).parents("tr").find(".G3").val(0);
            }
        }
    });

    return good;
}

function invia() {
    var arG1, arG2, arG3, arG4;
    var count = 0;
    count = 0;
    arG1={};
    arG4={};
    $(".G1").each(function(){
        if ($(this).val()){
        arG1[$(this).attr("name").substr(3,6)] = $(this).val();}
        else{
            arG1[$(this).attr("name").substr(3,6)] = 'null';
        }

        arG4[count]= $(this).attr("name").substr(3,6);
        count = count +1;
    });

    arG2={};
    $(".G2").each(function(){
        if($(this).val()) {
            arG2[$(this).attr("name").substr(3, 6)] = $(this).val();
        }
        else{
            arG2[$(this).attr("name").substr(3, 6)] = 'null';
        }
    });

    arG3={};
    $(".G3").each(function(){
        if($(this).val()) {
            arG3[$(this).attr("name").substr(3, 6)] = $(this).val();
        }
        else{
            arG3[$(this).attr("name").substr(3, 6)] = 'null';
        }
    });

    var SarG1 = JSON.stringify(arG1);
    var SarG2 = JSON.stringify(arG2);
    var SarG3 = JSON.stringify(arG3);
    var SarG4 = JSON.stringify(arG4);
    $.post('/salvaris',{
        tab1 : SarG1,
        tab2 : SarG2,
        tab3 : SarG3,
        tab4 : SarG4
    }, function(data,status) {
            if (status == 'success') {
                $(".alert-success").show();
            }
        }
    );
}

function validate() {
    if (checkSubmit()) {
        invia();
    }
    else {
        $(".alert-danger").show();
    }
}