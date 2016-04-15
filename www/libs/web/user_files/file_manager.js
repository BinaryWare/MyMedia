var root_user_path = '/';
var root_last_user_path = '';
var selected_file_list = [];

function resizeFileListWidget(){
    var height_body = ($(window).height()-$($('.container-fluid')[0]).height())-129;
    var width_body = ($(window).width()*70)/100;
    var style_attr = 'overflow-x: auto; height:'+height_body+'px; margin-top: 25px;';

    $('#f_user_list').attr('style', style_attr);
    $('#f_viewer').attr('style', style_attr+' width:'+width_body+'px;');
}

function addItemToMultiSelector(isElemActive, item){
  if(!isElemActive){
    selected_file_list.push(item);
  }else{
      var item_index = selected_file_list.indexOf(item);

      if(item_index!==-1)
        selected_file_list.splice(item_index, 1);
  }

  if(selected_file_list.length===0)
    $('#del_file_btn').addClass('disabled');
  else
    $('#del_file_btn').removeClass('disabled');
}

function detectActiveElement(elem, isElemActive, ctrlKey){
  if(!ctrlKey){
    $('#f_user_list').find('a').not(this).removeClass('active');
    selected_file_list = [];
  }

  if(isElemActive){
    $(elem).removeClass('active');
    $('#del_file_btn').addClass('disabled');
  }else{
    $(elem).addClass('active');
    $('#del_file_btn').removeClass('disabled');
  }
}

function returnDir(){
    selected_file_list = [];

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

function openDir(folder, elem, event){
    var isElemActive = $(elem).hasClass('active');

    detectActiveElement(elem, isElemActive, event.ctrlKey);

    if(!event.ctrlKey){
      root_last_user_path = root_user_path;
      root_user_path += folder+'/';

      loadUserDir(root_user_path);
    }else{
      addItemToMultiSelector(isElemActive, folder);
    }
}

function openFilePreview(filename, elem, event){
    var isElemActive = $(elem).hasClass('active');

    detectActiveElement(elem, isElemActive, event.ctrlKey);

    if(!event.ctrlKey){
      if(!isElemActive)
        $('#f_viewer').attr('src', location.origin+'/mmapi/fu/get/preview?f='+window.encodeURIComponent(filename)+'&p='+window.encodeURIComponent(root_user_path));
      else
        $('#f_viewer').attr('src', 'about:blank');
    }else{
      addItemToMultiSelector(isElemActive, filename);
    }
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
            html += '<a onclick="returnDir();" class="list-group-item"><span class="fa fa-folder"></span> ../ (Previous Folder)</a>';

        if (u_dir_length === 0) {
            html += '<a class="list-group-item list-group-item-danger">There is no files!</a>';
        } else {
            for (var c = 0;c < u_dir_length; c++) {
                var item = u_dir[c];
                var isFile = item.isFile;
                var name = item.name;
                var action_on_click = '';

                if(isFile)
                    action_on_click = 'openFilePreview(\''+name+'\', this, event);';
                else
                    action_on_click = 'openDir(\''+name+'\', this, event);';

                html += '<a onmousedown="'+action_on_click+'" class="list-group-item"><span class="fa fa-'+(isFile?'file':'folder')+'"></span> '+name+'</a>';
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

function uploadFinishedCallback(isUploadFailed){
    var msg = 'File uploaded successfully!';
    var msg_type = 'info';

    $('#upload_file_progress_area').hide();
    $('#upload_file_progress').html('0 %');
    $('#upload_file_progress').attr('style', 'width: 0%;');

    if (isUploadFailed) {
        msg = 'Cannot upload this file!';
        msg_type = 'danger';
    } else {
        loadUserDir();
        $('#close_upload_file_modal_btn').click();
    }

    messageBox(msg, msg_type);
    finishLoading();
}

function submitFile(filename, firstUpload, file_result, sucess_callback, failed_callback) {
    file_result = window.btoa(file_result);

    $.ajax({
        url: '/mmapi/fu/add/file',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            fname: filename,
            fpath: root_user_path,
            fdata: file_result,
            foverwrite: firstUpload
        })
    }).done(function () {
        sucess_callback();
    }).fail(function () {
        failed_callback();
    });
}

function onUploadFile(){
    startLoading();

    var firstUpload = true;
    var BLOB_SIZE_LIMIT = 1024*1024;
    var blobFileSectors = 0;
    var isUploadFailed = false;

    var fileList = this.files;
    var file = fileList[0];
    var fileSize = file.size;
    var filename = file.name;

    $('#upload_file_progress_area').show();

    if(fileSize<=BLOB_SIZE_LIMIT){
        var reader = new FileReader();

        reader.onloadend = function (file_res) {
            var file_result = file_res.target.result;

            submitFile(filename, firstUpload, file_result, function () {
                uploadFinishedCallback(false);
            }, function () {
                uploadFinishedCallback(true);
            });
        };

        reader.onprogress = function(e){
            var calcPercentage = Math.round((e.loaded * 100) / e.total);

            $('#upload_file_progress').html(calcPercentage + ' %');
            $('#upload_file_progress').attr('style', 'width: ' + calcPercentage + '%;');
        };

        reader.onerror = function (e) {
            uploadFinishedCallback(true);
        };

        reader.readAsBinaryString(file);
    } else {
        var items = new Array(Math.round(fileSize / BLOB_SIZE_LIMIT));
        async.forEachOfSeries(items, function (value, key, callback) {
            var calcPercentage = function () {
                return Math.round((key * 100) / items.length);
            };

            $('#upload_file_progress').html(calcPercentage() + ' %');
            $('#upload_file_progress').attr('style', 'width: ' + calcPercentage() + '%;');

            var reader = new FileReader();

            reader.onloadend = function (file_res) {
                var file_result = file_res.target.result;

                submitFile(filename, firstUpload, file_result, function(){
                    if (firstUpload)
                        firstUpload = false;

                    callback();
                }, function(){
                    isUploadFailed = true;

                    callback();
                });
            };

            reader.onerror = function (e) {
                isUploadFailed = true;
                callback();
            };

            var nextBlob = blobFileSectors + BLOB_SIZE_LIMIT;
            if (blobFileSectors >= fileSize)
                blobFileSectors = fileSize;

            if (nextBlob >= fileSize)
                nextBlob = fileSize;

            var fileData = file.slice(blobFileSectors, nextBlob);
            reader.readAsBinaryString(fileData);

            blobFileSectors = nextBlob;
        }, function () {
            uploadFinishedCallback(isUploadFailed);
        });
    }
}
