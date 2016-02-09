/**
 * @param {Object} req
 * @param {Object} res
 * 
 * @returns {undefined}
 * 
 * @description Logout user session function.
 */
exports.doLogout = function (req, res) {
    res.clearCookie('mmu', { httpOnly: true });
    res.redirect('/');
};

