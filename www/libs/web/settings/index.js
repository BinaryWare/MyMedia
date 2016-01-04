$(document).ready(function(){
    $('#c_pwd_btn').on('click', function(){
        startLoading();
        $.ajax({
            url: '/mmapi/user/cpwd',
            type: 'POST',
            contentType: 'application/json',
            data:JSON.stringify({
                o_pwd: $('#o_pwd').val(),
                n_pwd: $('#n_pwd').val()
            }),
            statusCode: {
                200: function(){
                    messageBox('Password changed successfully!', 'info');
                    
                    $('#o_pwd').val('');
                    $('#n_pwd').val('');
                },
                500: function(){
                    messageBox('Check if the password field is not empty or it has at least 5 characters!', 'danger');
                },
                201: function(){
                    messageBox('Cannot change password, try later or contact the administrator!', 'danger');
                },
                404: function(){
                    messageBox('The old password is not valid, enter the valid password please!', 'danger');
                }
            }
        }).done(function(){
            finishLoading();
        });
    });
    
    $('#d_acc_btn').on('click', function(){
        open_confirm('<strong>Do you want delete this account?</strong>', 'Delete Account', 'Delete', 'Close', function(){
            close_confirm();
            startLoading();
            $.ajax({
                url: '/mmapi/user/delete/',
                type: 'POST',
                contentType: 'application/json',
                data: {},
                statusCode: {
                    200: function () {
                        messageBox('Account deleted successfully!', 'info');
                        setTimeout(function () {
                            window.location = '/mmapi/user/logout';
                        }, 3000);
                    },
                    404: function () {
                        finishLoading();
                        messageBox('This user cannot be deleted!', 'danger');
                    }
                }
            });
        }, function(){
            close_confirm();
        });
    });
});

