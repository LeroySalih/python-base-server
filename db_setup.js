require('dotenv').config()

const main = async () => {
    var mySession = null;
    try{
        
        const mysql = require('mysql');

        console.log('Connecting using:', process.env.DB_URL)
        const dbConn = mysql.createConnection(process.env.DB_URL);

        dbConn.connect(err => {

            if (err) throw err;
            console.log('Connected!');

            if (process.env.DEBUG == 1){
                dbConn.query("DROP DATABASE IF EXISTS jf2u6xfv1edsbwh5", (err, result) => {
                if (err) throw err;
                console.log("Database dropped");
                });

                dbConn.query("CREATE DATABASE jf2u6xfv1edsbwh5 ", 
                    (err, result) => {
                    if (err) throw err;
                    console.log("Database created");
                });
            }
            

            dbConn.query(`USE jf2u6xfv1edsbwh5;`, (err, result) => {
                if (err) throw err;
                console.log("USING jf2u6xfv1edsbwh5");
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
            });

            dbConn.query(`CREATE TABLE user_profile (
                email           varchar(100) PRIMARY KEY NOT NULL,
                isTeacher       int DEFAULT 0, 
                created         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`, (err, result) => {
                if (err) throw err;
                console.log("Creating Table: user_profile");
            })

            dbConn.query(`INSERT INTO user_profile (email, isTeacher)
                            VALUES('LeroySalih@bisak.org', '1') 
            `, (err, result) => {
                if (err) throw err;
                console.log("Inserting Teacher: :LeroySalih@bisak.org");
            })

            dbConn.query(`SELECT *  FROM user_profile WHERE email=?`, ['LeroySalih@bisak.org'], (err, result) => {
                if (err) throw err;
                console.log(`Table: user_profile`, result);
            });

            dbConn.query(`DELETE FROM user_profile`);

            dbConn.query(`SELECT COUNT(*) as R_COUNT FROM user_profile`, (err, result) => {
                if (err) throw err;
                console.log(`Found ${result[0]['R_COUNT']} rows in table`);
            });


            dbConn.query(`CREATE TABLE pods (
                id              int PRIMARY KEY NOT NULL AUTO_INCREMENT,
                title           varchar(100),
                baseUrl         varchar(255),
                lessonId          varchar(100),
                moduleId          varchar(100),
                podOrder           int,  
                created         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`, (err, result) => {
                if (err) throw err;
                console.log("Creating Table: pods");
            })

            dbConn.query(`INSERT INTO pods (title, baseUrl, lessonId, moduleId, podOrder)
                          VALUES('Test Pod 1', 'http://github.io', 'l1', 'm1', 1) 
            `, (err, result) => {
                if (err) throw err;
                console.log("Inserting Pod: :Test Pod 1");
            })

            dbConn.query(`SELECT *  FROM pods WHERE title=?`, ['Test Pod 1'], (err, result) => {
                if (err) throw err;
                console.log(`Table: pods`, result);
            });

            dbConn.query(`DELETE FROM pods`);

            dbConn.query(`SELECT COUNT(*) as R_COUNT FROM pods`, (err, result) => {
                if (err) throw err;
                console.log(`Found ${result[0]['R_COUNT']} rows in table`);
            });



            dbConn.end();

        });

    } catch (error) {
        console.log(error.message);
        if (mySession.xSession)
            mySession.xSession.close()
    }
    
    
}

main()
