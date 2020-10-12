const router = require("express").Router() 
const passport = require("passport")
const util = require('util')
const MicrosoftStrategy = require('passport-microsoft').Strategy
const db = require('../database')

// require ("isomorphic-fetch");
// var MicrosoftGraph = require("@microsoft/microsoft-graph-client");
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete Microsoft graph profile is
//   serialized and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Use the MicrosoftStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and 37signals
//   profile), and invoke a callback with a user object.

if (process.env.DEBUG == 1){
    console.log(`App Id: ${process.env.MICROSOFT_APP_ID}`)
    console.log(`App Secret: ${process.env.MICROSOFT_APP_SECRET}`)
}

passport.use(new MicrosoftStrategy({
  clientID: process.env.MICROSOFT_APP_ID,
  clientSecret: process.env.MICROSOFT_APP_SECRET,
  callbackURL: process.env.MICROSOFT_APP_CALLBACK_URL,
  scope: ['user.read', 'EduRoster.Read']
},
  function (accessToken, refreshToken, profile, done) {

    //console.log("Access token received:", accessToken);
    profile.accessToken = accessToken
    profile.refreshToken = refreshToken
    //console.log("Profile:", profile);

    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Microsoft Graph profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the Microsoft account with a user record in your database,
      // and return that user instead.
      console.log('Processing Passport Request:', profile); 

      return db.getUser(profile._json.mail)
        .then((userProfile) => {
            
            if (!userProfile) {
                return done(new Error("No User Found"), null)
            }
            userProfile['displayName'] = profile._json['displayName']
            console.log('UserProfile: ', userProfile)
            return done(null, userProfile)
        })
        .catch((err) => {
            return done(err, null);
        } ) 
        
    });
  }
));

router.get('/', (req, res) => res.json({msg: 'ok'}))
// GET /auth/microsoft
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in Microsoft Graph authentication will involve
//   redirecting the user to the common Microsoft login endpoint. After authorization, Microsoft
//   will redirect the user back to this application at /auth/microsoft/callback
router.get('/microsoft',
  passport.authenticate('microsoft'),
  function (req, res) {
    // The request will be redirected to Microsoft for authentication, so this
    // function will not be called.
  });

  // GET /auth/microsoft/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/');
  });

  router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;