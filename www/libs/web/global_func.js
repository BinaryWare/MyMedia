function centerWindow(obj_to_center){
    var screen_w = $(document).width();
    var screen_h = $(document).height();
    
    var login_w = $(obj_to_center).width();
    var login_h = $(obj_to_center).height();
    
    var total_w = (screen_w-login_w)/2;
    var total_h = (screen_h-login_h)/2;
    
    $($(obj_to_center).parent()).attr('style', 'top:'+total_h+'px; left: '+total_w+'px;');
}

