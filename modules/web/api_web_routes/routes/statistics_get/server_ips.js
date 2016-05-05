var os = require('os');
var global_func = require('../../global_functions');

/**
 * @param {Object} req
 * @param {Object} res
 *
 * @returns {undefined}
 *
 * @description Statisctics of all local address.
 */
exports.getAllNetworks = function (req, res) {
   var interfaces = os.networkInterfaces();
   var keys = Object.keys(interfaces);
   var result_interfaces = [];

   for (var c = 0; c < keys.length; c++) {
       var inter = interfaces[keys[c]];
       for (var x = 0; x < inter.length; x++) {
         result_interfaces.push({
           address:inter[x].address,
           family: inter[x].family
         });
       }
   }

   res.send(JSON.stringify({ net_inter: result_interfaces }));
};
