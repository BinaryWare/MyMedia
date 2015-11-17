/**
 * @param {Object} proc
 * 
 * @returns {undefined}
 * 
 * @description Detects if the current process is using any system parameter.
 */
exports.detectParams = function(proc){
    var params = proc.argv;
    var params_total = params.length;
    var last_param = params[(params_total-1)];
    
    if(last_param!=='no_gui'){
        var app_sys = require('../app_sys');
        
        // Loads all GUI components
        app_sys.loadAppSys();
    }
};

