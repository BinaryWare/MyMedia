var refreshStatsTimer = null;

function loadStats(){
    $.ajax({
        url:'/mmapi/stats/get',
        type: 'GET',
        dataType: 'json'
    }).done(function(stats){
        $('#u_number').val(stats.u_number);
        $('#a_number').val(stats.a_number);
        $('#us_number').val(stats.us_number);
    }).fail(function(){
        clearInterval(refreshStatsTimer);
        messageBox('Can\'t load the statistics!', 'danger');
    });
}

$(document).ready(function(){
    loadStats();
    
    refreshStatsTimer = setInterval(loadStats, 60*1000);
});

