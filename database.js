var mysql = require('mysql')

var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: ProcessingInstruction.env.MYSQL_DATABASE,
    connectionLimit: 10, 
    supportBigNumbers: true
})

exports.addTestResult = (email, podId, testResults) => {
    return new Promise((res, rej) => {
        var insertSql = `INSERT INTO test_status(email, podId, result) VALUES (?, ?, ?)`

        pool.getConnection((err, connection) => {
            if (err) {
                rej(err);
                return;
            }

            connection.query(insertSql, [email, podId, testResults], (err, results) => {
                connection.release()
                if (err) {
                    rej(err)
                    return;
                } else {
                    res(results)
                }
            })
        })
    }); // promise
    
}