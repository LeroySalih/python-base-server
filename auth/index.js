const router = require("express").Router() 
const passport = require("passport")

router.get('/', (req, res) => {
    res.send("OK")
})
router.get('/microsoft',
      passport.authenticate('microsoft'));
 
router.get('/microsoft/callback', 
    passport.authenticate('microsoft', { failureRedirect: '/login' }),
    function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
    });

module.exports = router;