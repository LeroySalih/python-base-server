require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
var mysql = require('mysql');


const auth = require("./auth/index.js");
app.use("/auth", auth)

const api = require("./api");
app.use('/api', api);

//Loads the handlebars module
const handlebars = require('express-handlebars');

//instead of app.set('view engine', 'handlebars'); 
app.set('view engine', 'hbs');

//instead of app.engine('handlebars', handlebars({
app.engine('hbs', handlebars({
layoutsDir: __dirname + '/views/layouts',
//new configuration parameter
extname: 'hbs',
defaultLayout:"index"
}));



app.use(express.static('public'))

function createQuery (connection, sql, params) {
    return  new Promise((res, rej) => {
        connection.query(
            sql, params,
            (err, rows, fields) => {
                console.log(err);
                if (err) rej();
                console.log('Table Created: ', rows);
                res(rows);
        });
    });
}


require('./config/passport-setup.js');

app.get('/', (req, res) => {
    res.render('main', {title: "My Awsome App"})
})

app.get('/test', (req, res) => {
    const devUrl = "mysql://pnwsugsir2123vxs:fv7zby06obq50zpo@durvbryvdw2sjcm5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/jf2u6xfv1edsbwh5"
    console.log("DB URL Found")
    console.log("************")
    console.log(process.env.JAWSDB_URL || devUrl);
    console.log("************")
    var connection = mysql.createConnection(process.env.JAWSDB_URL|| devUrl );
    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) throw err;

        console.log('The solution is: ', rows[0].solution);

        res.send(`
    <html>
    <body>
    <div><a href="/registrations">Registrations</a></div>
    <div><a href="/register/sleroy">Register</a></div>
    <div>DB is connected: ${rows[0].solution == 2}</div>
    </body>
    </html>
    `)
    });

    connection.end();

    
})

app.get('/registrations', (req, res) => {
    
    var connection = mysql.createConnection(process.env.JAWSDB_URL);
    connection.connect();

    p1 = createQuery(connection, "select * from registrations")

    Promise.all([p1])
        .then((data) => {
            res.json(data);
        });

    connection.end();

});

app.get('/register/:userId',(req, res) => {
    
    const userId = req.params.userId 
    
    console.log(`Received a request to register ${userId}`)

    var connection = mysql.createConnection(process.env.JAWSDB_URL);
    connection.connect();

    p1 = createQuery(connection, `INSERT INTO registrations (name, dt) VALUES (?, NOW())`, [userId]);
    
    Promise.all([p1])
        .then((data) => {
            res.json(data);
        });

    connection.end();

    
})

app.listen(port, ()=> {
    console.log(`Example app listening at http://localhost:${port}`)
})