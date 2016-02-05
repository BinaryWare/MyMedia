var FILE_EXTENSIONS = ['pdf', 'jpg', 'png', 'jpeg', 'gif', 'ico'];
var root_user_path = '/';
var root_last_user_path = '';

function resizeFileListWidget(){
    var height_body = ($(window).height()-$($('.container-fluid')[0]).height())-49;
    var width_body = ($(window).width()*70)/100;
    var style_attr = 'overflow-x: auto; height:'+height_body+'px; margin-top: 25px;';
    
    $('#f_user_list').attr('style', style_attr);
    $('#f_viewer').attr('style', style_attr+' width:'+width_body+'px;');
}

function openDir(folder){
    root_last_user_path = root_user_path;
    root_user_path += folder+'/';
    
    loadUserDir(root_user_path);
}

function returnDir(){
    var res_dir = '/';
    var dirs = root_user_path.split('/');
    for(var c=0;c<dirs.length-2;c++){
        var dir = dirs[c];
        if(dir!=='')
            res_dir += dir+'/';    
    }
    
    root_user_path = res_dir;
    loadUserDir(res_dir);
}

function openFile(filename){
    $('#f_viewer').val('');
    startLoading();
    $.ajax({
        url: '/mmapi/fu/get/file',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            path: root_user_path,
            file: filename
        })
    }).done(function (ufile_data) {
        $('#f_viewer').val(window.atob(ufile_data));
        finishLoading();
    }).fail(function () {
        $('#f_viewer').val('Cannot read file '+filename+'!');
        messageBox('Cannot read file '+filename+'!', 'danger');
        finishLoading();
    });
}

function openFilePreview(filename){
    $('#f_viewer').attr('src', location.origin+'/mmapi/fu/get/preview?f='+window.encodeURIComponent(filename)+'&p='+window.encodeURIComponent(root_user_path));
}

function loadUserDir(user_path) {
    startLoading();
    
    $('#f_viewer').attr('src', '');
    
    if (user_path === undefined)
        user_path = root_user_path;

    $.ajax({
        url: '/mmapi/fu/get/dir',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
            path: user_path
        })
    }).done(function (user_directory) {
        var html = '';
        var u_dir = user_directory.u_dir;
        var u_dir_length = u_dir.length;

        if(user_path !== '/')
            html += '<a onclick="returnDir();" href="#" class="list-group-item"><span class="fa fa-folder"></span> ../</a>';

        if (u_dir_length === 0) {
            html += '<a href="#" class="list-group-item list-group-item-danger">There is no files!</a>';
        } else {
            for (var c = 0;c < u_dir_length; c++) {
                var item = u_dir[c];
                var isFile = item.isFile;
                var name = item.name;
                var action_on_click = '';
                
                if(isFile){
                    var name_split = name.split('.');
                    var ext = name_split[name_split.length-1];
                    
                    if(FILE_EXTENSIONS.indexOf(ext)!==-1)
                        action_on_click = 'openFilePreview(\''+name+'\');';    
                    else
                        action_on_click = 'openFile(\''+name+'\');';    
                }else{
                    action_on_click = 'openDir(\''+name+'\');';
                }
                
                html += '<a onclick="'+action_on_click+'" href="#" class="list-group-item"><span class="fa fa-'+(isFile?'file':'folder')+'"></span> '+name+'</a>';
            }
        }
        
        $('#f_user_list').html(html);
        finishLoading();
    }).fail(function () {
        root_user_path = root_last_user_path;
        messageBox('Cannot load user directories!', 'danger');
        finishLoading();
    });
}

$(document).ready(function () {
    resizeFileListWidget();
    loadUserDir();
});

$(window).resize(function(){
    resizeFileListWidget();
});