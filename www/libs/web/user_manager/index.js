var user_list = null;
var user_page_index = 0;
var user_max_items = 6;
var user_list_temp = [];

function loadUserMListTable(callback, page_number) {
    var html_users = '';
    if (page_number === undefined)
        page_number = 0;
    else
        user_page_index = page_number;

    if (user_list.length !== 0) {
        var user_start_index = (user_page_index * user_max_items);
        var user_end_index = user_start_index + 5;
        var counter = user_end_index;

        user_list_temp = user_list.splice(user_start_index, user_end_index);
        for (var c = 0; c < 5; c++) {
            var user = user_list_temp[c];
            if (user !== undefined && user !== null) {
                html_users += '<tr class="tr-row" data-index="' + (counter) + '"> <td>' + user.u + '</td> <td>' + user.up + '</td> <td></td> </tr>';
                counter++;
            }
        }
    }else{
        html_users = '<tr class="tr-row"> <td colspan="3"><strong>There is no users to show</strong></td> </tr>';
    }
    
    $('#um_list').html(html_users);
    $('#um_pages_label').html('Page '+page_number+' of '+(user_list.length/6));
    
    callback();
}

function loadUserMList(){
    startLoading(); 
    $.ajax({
        url: '/mmapi/users/list',
        dataType: 'json',
        type: 'GET'
    }).done(function(user_l){
        if(user_list===null)
            user_list = user_l.users;    
        
        loadUserMListTable(function(){
            finishLoading();
        });
    }).fail(function(){
        finishLoading();
        messageBox('Cannot load user list!', 'danger');
    });
}

$(document).ready(function(){
    loadUserMList();
});
