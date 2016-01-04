var hideNotification = null;

function centerWindow(obj_to_center){
    var screen_w = $(document).width();
    var screen_h = $(document).height();
    
    var login_w = $(obj_to_center).width();
    var login_h = $(obj_to_center).height();
    
    var total_w = (screen_w-login_w)/2;
    var total_h = (screen_h-login_h)/2;
    
    $($(obj_to_center).parent()).attr('style', 'top:'+total_h+'px;');
}

function startLoading() {
    $('.loader').addClass('active');
    $("#backgroundLoading").attr("class", "back-load");
}

function finishLoading() {
    $('.loader').removeClass('active');
    $('#backgroundLoading').removeAttr('class');
}

function closeMessageBox(message_type){
    if(message_type===undefined){
        var msg_class = $('#msg_e').attr('class');
        var class_array = msg_class.split(' ');
        
        for(var c=0;c<class_array.length;c++){
            var item = class_array[c];
            if(item.indexOf('alert-')!==-1){
                message_type = item;
                break;
            }
        }
    }
    
    $('#msg_e').fadeOut(500, function(){
        $('#msg_e').removeClass(message_type);
        clearTimeout(hideNotification);
        hideNotification=null;
    });
}

function messageBox(msg, message_type, time){
    if(message_type===undefined)
        message_type = 'alert-success';
    else
        message_type = 'alert-'+message_type;
    
    $('#msg_e').addClass(message_type);
    $('#mb_msg').html(msg);
    
    if(time===undefined)
        time = 5000;
    
    $('#msg_e').fadeIn(500);
    
    clearInterval(hideNotification);
    hideNotification = setTimeout(function(){
        closeMessageBox(message_type);
    }, time);
}

function open_confirm(msg, title, confirm_btn_msg, cancel_btn_msg, confirm_callback, close_callback){
    $('#c_modal_title').html(title);
    $('#c_modal_body').html(msg);
    
    $('#c_confirm_btn').html(confirm_btn_msg);
    $('#c_close_btn').html(cancel_btn_msg);
    
    $('#c_confirm_btn').on('click', confirm_callback);
    $('#c_close_btn').on('click', close_callback);
    
    $('#confirm_modal').modal('show');
}

function close_confirm(){
    $('#confirm_modal').modal('hide');
}

$(document).ready(function(){
    $('#msg_e').hide();
    
    $('#mb_close').on('click', function(){
        closeMessageBox();
    });
});
