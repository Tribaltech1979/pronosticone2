/**
 * Created by Schiappacassed on 19/09/2015.
 */
$(document).ready(function () {
    $(".alert").hide();

});

$(':file').change(function(){
    var file = this.files[0];
    var name = file.name;
    var size = file.size;
    var type = file.type;
    //Your validation
});

function checkSubmit(){
    $(".alert").hide();
    var good = true;
    $("input").css("background-color","white");
    good = true;

    $(".G1,.G2,.G3").each(function(){
        if(!$(this).val()){
            $(this).css('background-color','red');
            good = false;
        }
    });

    if( $(".G2").val() != $(".G3").val()){

        $(".G2").css('background-color','red');
        $(".G3").css('background-color','red');
        good = false;
    }

    return good;
}

function invia(){
    $.post("/cambiop",{
            passold : $(".G1").val(),
            passnew : $(".G2").val()
        },
        function(data,status){        if(status=='success'){
            $(".alert-success").show();
        }
        else{
            $(".alert-danger").show();
        }
        }
    );
}

function validate1() {
    $(".alert").hide();
    if($(".G1").val() && $(".G1").val().length < 50){
        $.post("/cambiosq",{
            sqnew : $(".G1").val()
        },
            function(data,status){        if(status=='success'){
                $(".alert-success").show();
            }
            else{
                $(".alert-danger").show();
            }
            })
    }
    else {
        $(".alert-danger").show();
    }

}

function validate2(){
    $(".alert").hide();

    var formData = $(':file').val();
    $.ajax({
        url: '/photo',  //Server script to process data
        type: 'POST',
        xhr: function() {  // Custom XMLHttpRequest
            var myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){ // Check if upload property exists
                myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // For handling the progress of the upload
            }
            return myXhr;
        },
        //Ajax events
        //beforeSend: beforeSendHandler,
        //success: completeHandler,
        //error: errorHandler,
        // Form data
        data: formData,
        //Options to tell jQuery not to process data or worry about content-type.
        cache: false,
        contentType: false,
        processData: false
    });

}

function validate3(){
    $(".alert").hide();
    if($(".G3").val()){
        var checkb = '';

       if($(".G4").is(':checked')){
           checkb = 'X';
       }


        $.post("/cmail",{
                smail : $(".G3").val(),
                avv : checkb
            },
            function(data,status){        if(status=='success'){
                $(".alert-success").show();
            }
            else{
                $(".alert-danger").show();
            }
            })
    }
    else{
        $(".alert-danger").show();
    }
}