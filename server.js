var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , MicrosoftStrategy = require('passport-microsoft').Strategy


const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

require ("isomorphic-fetch");

var MicrosoftGraph = require("@microsoft/microsoft-graph-client");
var MICROSOFT_GRAPH_CLIENT_ID = "56ac7b49-77e4-4eb2-961a-040358a808d0"
var MICROSOFT_GRAPH_CLIENT_SECRET = "Lqlb-CcGw6._OsLgx97c6WI4mN4~7oFsR1";

//Loads the handlebars module
const handlebars = require('express-handlebars');


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
passport.use(new MicrosoftStrategy({
  clientID: MICROSOFT_GRAPH_CLIENT_ID,
  clientSecret: MICROSOFT_GRAPH_CLIENT_SECRET,
  callbackURL: "https://3000-ab155182-05d4-4bf5-b47e-2b757b153877.ws-eu01.gitpod.io/auth/microsoft/callback",
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
      return done(null, profile);
    });
  }
));

var app = express();

// configure Express
app.set('views', __dirname + '/views');
  
//instead of app.set('view engine', 'handlebars'); 
app.set('view engine', 'hbs');  

//instead of app.engine('handlebars', handlebars({
app.engine('hbs', handlebars({
    layoutsDir: __dirname + '/views/layouts',

    //new configuration parameter
    extname: 'hbs',
    defaultLayout:"index"
}));
  


app.use(logger('tiny'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'keyboard cat', resave: true,
    saveUninitialized: true }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

app.use('/api', require('./api'))


app.get('/', function (req, res) {
    console.log(req.user)
    res.render('main', { user: req.user });
});




/*
app.get('/account', ensureAuthenticated, async function (req, res) {
    console.log(req.user);
    console.log(req.user.accessToken);

    client = MicrosoftGraph.Client.init({
        defaultVersion: "beta",
        defaultLogging: true,
        authProvider: (done) => {
            done(null, req.user.accessToken);
        }
    });

    client
        .api("/education/me/classes")
        .get()
        .then((result) => {
                console.log("Received: ********")
                console.log(result)
                console.log("Received: ********")
                res.render('account', {user: req.user, classes: result.value})
        
            })
        .catch((err) => console.error(err))
});

/*
app.get('/login', function (req, res) {
  res.render('login', { user: req.user });
});
*/
// GET /auth/microsoft
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in Microsoft Graph authentication will involve
//   redirecting the user to the common Microsoft login endpoint. After authorization, Microsoft
//   will redirect the user back to this application at /auth/microsoft/callback
app.get('/auth/microsoft',
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
app.get('/auth/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


const mysql = require('mysql');

const dbConn = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'pwdpwd'
});

dbConn.connect(err => {

    if (err) {
        console.log(err)
    }
    console.log('DB Connected');

    console.log('Listening')
    app.listen(3000);

});





// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}
