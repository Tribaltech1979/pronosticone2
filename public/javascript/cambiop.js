$(document).ready(function () {
    $(".alert").hide();

})

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

function validate() {
    if (checkSubmit()) {
       // document.getElementById("compila").submit();
        invia();
    }
    else {
        $(".alert-danger").show();
    }
}