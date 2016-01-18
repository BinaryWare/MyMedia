var user_list = null;
var user_page_index = 0;
var user_max_items = 6;
var user_list_temp = [];

function getUserPerm(uperm) {
    var user_perm = uperm.split(',');
    var html_user_perm = '';
    if (user_perm.length !== 0) {
        if (user_perm.indexOf('A') !== -1)
            html_user_perm += '<span class="fa fa-users"></span> ';

        if (user_perm.indexOf('U') !== -1)
            html_user_perm += '<span class="fa fa-user"></span> ';

        if (user_perm.indexOf('U-') !== -1)
            html_user_perm += '<span class="fa fa-user-secret"></span>';
    }else{
        html_user_perm += '<strong>No Permissions</strong>';
    }
    return html_user_perm;
}

function loadUserMListTable(callback, page_number) {
    var html_users = '';
    if (page_number === undefined)
        page_number = 0;
    else
        user_page_index = page_number;
    
    if(user_list === null)
        user_list = [];

    if (user_list.length !== 0) {
        $('#um_previous').removeClass('disabled');
        $('#um_next').removeClass('disabled');
        
        var user_start_index = (user_page_index * user_max_items);
        var user_end_index = user_start_index + 5;
        var counter = user_end_index;

        user_list_temp = user_list.splice(user_start_index, user_end_index);
        for (var c = 0; c < 5; c++) {
            var user = user_list_temp[c];
            if (user !== undefined && user !== null) {
                var html_user_perm = getUserPerm(user.up);
                
                html_users += '<tr class="tr-row" data-index="' + (c) + '">';
                
                html_users += '<td>' + user.u + '</td>';
                html_users += '<td>' + html_user_perm + '</td>';
                html_users += '<td>';
                html_users += '<button data-index="'+ (c) +'" onclick="deleteUser(this);" class="btn btn-danger"><span class="fa fa-times"></span></button> ';
                html_users += '<button data-index="'+ (c) +'" onclick="editUser(this);" class="btn btn-primary"><span class="fa fa-edit"></span></button>';
                html_users += '</td>';
                
                html_users += '</tr>';
                
                counter++;
            }
        }
    }else{
        html_users = '<tr class="tr-row"> <td colspan="3"><strong>There is no users to show</strong></td> </tr>';
        
        $('#um_previous').addClass('disabled');
        $('#um_next').addClass('disabled');
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
        user_list = user_l.users;    
        
        loadUserMListTable(function(){
            messageBox('User list loaded successfully!', 'success');
            finishLoading();
        });
    }).fail(function(){
        finishLoading();
        messageBox('Cannot load user list!', 'danger');
    });
}

function clearAddUserFields(){
    $('#add_user_username').val('');
    $('#add_user_password').val('');
    $('#add_user_c_password').val('');
    
    $('#add_user_is_admin').prop('checked', false);
    $('#add_user_is_user').prop('checked', false);
    $('#add_user_is_viewer').prop('checked', false);
}

function deleteUser(item){
    open_confirm('Are you shure you want delete this user?', 'Delete Account', 'Delete', 'Cancel', function(){
        startLoading();
        
        var data_id = $(item).attr('data-index');
        var username = user_list_temp[data_id].u;
                
        $.ajax({
            url:'/mmapi/user/delete/'+username,
            type: 'POST',
            data: {},
            statusCode: {
                200:function(){
                    messageBox('User deleted successfully!', 'success');
                    $('#um_table_refresh').click();
                    close_confirm();
                },
                500:function(){
                    messageBox('Cannot delete the user '+username+'!', 'danger');
                }
            }
        }).done(function(){
            finishLoading();
        }).fail(function(){
            finishLoading();
        });   
    });
}

function editUser(item){
    var data_id = $(item).attr('data-index');
    var user = user_list_temp[data_id];
    var uperm = user.up;
    
    $('#edit_user_username').val(user.u);
    $('#edit_user_password').val(user.p);
    
    $('#edit_user_is_admin').prop('checked', (uperm.indexOf('A')!==-1));
    $('#edit_user_is_user').prop('checked', (uperm.indexOf('U')!==-1));
    $('#edit_user_is_viewer').prop('checked', (uperm.indexOf('U-')!==-1));
    
    $('#um_edit_user_modal_modal').modal('show');
}

$(document).ready(function(){
    loadUserMList();
    
    $('#um_table_refresh').on('click', function(){
        loadUserMList(); 
    });
    
    $('#um_add_user').on('click', function(){
        $('#um_add_user_modal_modal').modal('show');
    });
    
    $('#btn_add_user_close_btn').on('click', function(){
        $('#um_add_user_modal_modal').modal('hide');
        clearAddUserFields();
    });
    
    $('#btn_add_user_confirm_btn').on('click', function(){
        startLoading();
        var user_perm = [];
        var username = $('#add_user_username').val();
        var password = $('#add_user_password').val();
        var c_password = $('#add_user_c_password').val();
        
        if(username==='' || username===' ' || username.indexOf(' ')!==-1){
            messageBox('Invalid username!', 'danger');
            finishLoading();
        }else if(password==='' || password===' ' || password.length>=4){
            messageBox('Invalid password! You must have at least 4 characters without spaces!', 'danger');
            finishLoading();
        }else if(c_password===password){
            if ($('#add_user_is_admin').prop('checked'))
                user_perm.push('A');

            if ($('#add_user_is_user').prop('checked'))
                user_perm.push('U');

            if ($('#add_user_is_viewer').prop('checked'))
                user_perm.push('U-');

            $.ajax({
                url: '/mmapi/user/add',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    u: username,
                    p: password,
                    up: user_perm.toString()
                }),
                statusCode: {
                    200: function () {
                        $('#btn_add_user_close_btn').click();
                        messageBox('User created successfully!', 'success');
                        $('#um_table_refresh').click();
                    },
                    403: function () {
                        messageBox('You don\'t have permissions to do this operation!', 'danger');
                    },
                    500: function () {
                        messageBox('This user ' + username + ' is already exists!', 'danger');
                    }
                }
            }).done(function () {
                finishLoading();
            }).fail(function () {
                finishLoading();
            });
        } else {
            messageBox('The password you entered does not match the password you confirmed!', 'danger');
            finishLoading();
        }
    });
    
    $('#btn_edit_user_close_btn').on('click', function(){
        $('#um_edit_user_modal_modal').modal('hide');    
    });
    
    $('#btn_edit_user_confirm_btn').on('click', function () {
        startLoading();
        var user_perm = [];
        var username = $('#edit_user_username').val();
        var password = $('#edit_user_password').val();
        
        if (password === '' || password === ' ' || password.length >= 4) {
            messageBox('Invalid password! You must have at least 4 characters without spaces!', 'danger');
            finishLoading();
        } else {
            if ($('#edit_user_is_admin').prop('checked'))
                user_perm.push('A');

            if ($('#edit_user_is_user').prop('checked'))
                user_perm.push('U');

            if ($('#edit_user_is_viewer').prop('checked'))
                user_perm.push('U-');

            $.ajax({
                url: '/mmapi/user/edit',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    u: username,
                    p: password,
                    up: user_perm.toString()
                }),
                statusCode: {
                    200: function () {
                        messageBox('User edited successfully!', 'success');
                        $('#btn_edit_user_close_btn').click();
                        $('#um_table_refresh').click();
                    },
                    403: function () {
                        messageBox('You don\'t have permissions to do this operation!', 'danger');
                    },
                    500: function () {
                        messageBox('This user ' + username + ' doesn\'t exists!', 'danger');
                        $('#btn_edit_user_close_btn').click();
                        $('#um_table_refresh').click();
                    }
                }
            }).done(function () {
                finishLoading();
            }).fail(function () {
                finishLoading();
            });
        }
    });
});
