


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

            dbConn.query("DROP DATABASE IF EXISTS mydb", (err, result) => {
                if (err) throw err;
                console.log("Database dropped");
            });

            dbConn.query("CREATE DATABASE mydb ", 
                (err, result) => {
                if (err) throw err;
                console.log("Database created");
            });

            dbConn.query(`USE mydb;`, (err, result) => {
                if (err) throw err;
                console.log("USING mydb");
            })

            dbConn.query(`CREATE TABLE registration (
                ID          int PRIMARY KEY NOT NULL AUTO_INCREMENT,
                name        varchar(100)   
            )`, (err, result) => {
                if (err) throw err;
                console.log("Creating Table: registration");
            })

             dbConn.query(`INSERT INTO registration (name)
                            VALUES('testUser') 
            `, (err, result) => {
                if (err) throw err;
                console.log("Inserting test user: testUser");
            })

            dbConn.query(`SELECT * FROM registration`, (err, result) => {
                if (err) throw err;
                console.log(result);
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
