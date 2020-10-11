


const main = async () => {
    var mySession = null;
    try{
        
        const mysql = require('mysql');

        const dbConn = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'pwdpwd'
        });

        dbConn.connect(err => {

            if (err) throw err;
            console.log('Connected!');

            dbConn.query("DROP DATABASE IF EXISTS codepod", (err, result) => {
                if (err) throw err;
                console.log("Database dropped");
            });

            dbConn.query("CREATE DATABASE codepod ", 
                (err, result) => {
                if (err) throw err;
                console.log("Database created");
            });

            dbConn.query(`USE codepod;`, (err, result) => {
                if (err) throw err;
                console.log("USING codepod");
            })

            dbConn.query(`CREATE TABLE test_status (
                ID          int PRIMARY KEY NOT NULL AUTO_INCREMENT,
                email       varchar(100),
                podId       varchar(100),
                result      text,
                created     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`, (err, result) => {
                if (err) throw err;
                console.log("Creating Table: test_status");
            })

             dbConn.query(`INSERT INTO test_status (email, podId, result)
                            VALUES('testUser', '1', '[1, 1, 0]') 
            `, (err, result) => {
                if (err) throw err;
                console.log("Inserting test result: testUser");
            })

            dbConn.query(`SELECT * FROM test_status`, (err, result) => {
                if (err) throw err;
                console.log(result);
            })

            dbConn.query(`DELETE FROM test_status`);

            dbConn.query(`SELECT COUNT(*) as R_COUNT FROM test_status`, (err, result) => {
                if (err) throw err;
                console.log(`Found ${result[0]['R_COUNT']} rows in table`);
            })

            dbConn.end();

        });

    } catch (error) {
        console.log(error.message);
        if (mySession.xSession)
            mySession.xSession.close()
    }
    
    
}

main()
