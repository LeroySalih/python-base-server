var mysql = require('mysql')

var pool = mysql.createPool(process.env.DB_URL)

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

async function getResults () {
    console.log('getResults::')
    const sql = "SELECT * FROM test_status"
    return doQuery(sql, []);
}

module.exports.getResults = getResults;


exports.addTestResult = (email, podId, testResults) => {
    var sql = `INSERT INTO test_status(email, podId, result) VALUES (?, ?, ?)`
    return doQuery (sql, [email, podId, testResults])
}