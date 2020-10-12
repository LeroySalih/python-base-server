var mysql = require('mysql')

var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 10, 
    supportBigNumbers: true
})

const doQuery = (sql, params) => {
    return new Promise((res, rej) => {
        
        pool.getConnection((err, connection) => {
            if (err) {
                rej(err);
                return;
            }

            connection.query(sql, params, (err, results) => {
                connection.release()
                if (err) {
                    rej(err)
                    return;
                } else {
                    res(results)
                }
            })
        })
    });
}

exports.getUser = (email) => {
    console.log('getUser::', email)
    const sql = "SELECT * FROM user_profile WHERE email = ?"
    return doQuery(sql, [email])
                .then((result) => result.length == 1 ? result[0] : null);
}


async function getPods () {
    console.log('getPods::')
    const sql = "SELECT * FROM pods"
    return doQuery(sql, []);
}

module.exports.getPods = getPods;


exports.addTestResult = (email, podId, testResults) => {
    var sql = `INSERT INTO test_status(email, podId, result) VALUES (?, ?, ?)`
    return doQuery (sql, [email, podId, testResults])
}