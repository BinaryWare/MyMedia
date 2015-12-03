$(document).ready(function(){
    $('#u').focus();
    centerWindow('#loginWindow');
    
    $('#lg').on('click', function(){
        startLoading();
        $.ajax({
            url: '/mmapi/user/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: $('#u').val(),
                password: $('#p').val()
            })
        }).done(function(dat){
            window.location = dat;
        }).fail(function(){
            messageBox('Your password and username are wrong!', 'danger', 6000);
            finishLoading();
        });
    });
});

$(window).on('resize', function(){
   centerWindow('#loginWindow');
});