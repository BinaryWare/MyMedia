$(document).ready(function () {
    $('#upload_file_progress_area').hide();

    resizeFileListWidget();
    loadUserDir();

    $('#add_file_btn').on('click', function(){
        $('#upload_file_modal').modal('show');
    });

    $('#upload_file_input').on('change', onUploadFile);

    $('#add_folder_btn').on('click', function(){
        $('#add_folder_modal').modal('show');
    });

    $('#close_create_folder_modal_btn').on('click', function(){
      $('#add_folder_modal').modal('hide');
      $('#create_folder_input').val('');
    });
});

$(window).resize(function(){
    resizeFileListWidget();
});

$('.content').on('mouseup', function(e){
  e.preventDefault();

  var elem = $(e.target);
  if(!elem.hasClass('list-group-item')){
    $('#f_user_list').find('a').not(this).removeClass('active');
    $('#f_viewer').attr('src', 'about:blank');
    $('#del_file_btn').addClass('disabled');

    selected_file_list = [];
  } else {
    var isElemActive = elem.hasClass('active');
    detectActiveElement(elem, isElemActive);
  }
});
