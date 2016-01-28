exports.doLogout = function (req, res) {
    res.clearCookie('mmu', { httpOnly: true });
    res.redirect('/');
};

