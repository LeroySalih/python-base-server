require('dotenv').config()

var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , db = require('./database.js')
  



const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");




//Loads the handlebars module
const handlebars = require('express-handlebars');






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
    defaultLayout:"index",
    helpers : {
        displayResult: displayResult,
        log : (obj) => console.log('Debug:', obj),
        podUrl : (pod, user) => `<a href="https://gitpod.io/#APP_EMAIL=${user.email},POD_ID=${pod.id}/${pod.baseUrl}">${pod.title}</a>`
    }
}));
  
function displayLight(result) {
    return (result.status == 'passed') ? '<span style="color: green">' + result.status + '</span>' : '<span style="color: red">' + result.status + '</span>'
}
function displayResult(result) {
    const tests = eval(result.result)
    const test_results = tests.map((item) => displayLight(item))
    return `<div>
    <div>${result.ID} - ${tests.length} tests </div>
        <div>
            ${test_results}
        </div>
    </div>`
}


app.use(logger('tiny'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({ secret: 'keyboard cat', resave: true,
    saveUninitialized: true }));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
console.log('Passport: Initialising')
app.use(passport.initialize());
app.use(passport.session());

console.log('Static: Adding public directory')
app.use(express.static(__dirname + '/public'));

app.use('/api', require('./api'))
app.use('/auth', require('./auth'))

app.get('/', async function (req, res) {
    console.log(req.user)
    // getpods
    const pods = await db.getPods()
    console.log('Pods', pods )

    const results = await db.getResults()
    console.log('*****************')
    console.log('Results', results)
    console.log('*****************')
    
    res.render('main', { user: req.user, pods: pods, results: results });
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









console.log('App Name: ', process.env.APP_NAME)

console.log('Listening on ', process.env.PORT)
app.listen(process.env.PORT);
 




// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}
