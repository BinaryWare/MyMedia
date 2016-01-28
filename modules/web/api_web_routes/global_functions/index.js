var ROOT_PATH = '../../../';
var user_perm = require(ROOT_PATH+'db/user_permissions/user_permssions.js');
var cipher    = require(ROOT_PATH+'cipher');

function getCookieField(cookie, field_index) {
    var mmu = cookie.mmu;
    var dec_mmu = cipher.decode(mmu);
    var dec_mmu_arr = dec_mmu.split(';');
    return dec_mmu_arr[field_index];
};

exports.isAdminUser = function(cookie) {
    var mmu_perm_arr = getCookieField(cookie, 2).split(',');
    return (mmu_perm_arr.indexOf(user_perm.ADMIN) !== -1);
};

exports.getCookieField = getCookieField;


