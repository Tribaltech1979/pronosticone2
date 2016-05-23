/**
 * Created by Daniele on 31/08/2015.
 */

$(document).ready(function () {
    $(".alert").hide();

});

function save(){

    $.post("/salvatorneo", {
        torneo: $("input").filter("[name='torneo']").val(),
        giorn: $("input").filter("[name='giorn']").val()
    },
    function(data,status){
        if(status=='success'){
            $(".alert-success").show();
        }}
        );

}