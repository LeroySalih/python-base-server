require('dotenv').config()

const main = async () => {
    var mySession = null;
    try{
        
        const mysql = require('mysql');

        const dbConn = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD
        });

        dbConn.connect(err => {

            if (err) throw err;
            console.log('Connected!');

            dbConn.query(`USE codepod;`, (err, result) => {
                if (err) throw err;
                console.log("USING codepod");
            })

            dbConn.query(`INSERT INTO user_profile (email, isTeacher)
                            VALUES('LeroySalih@bisak.org', '1') 
            `, (err, result) => {
                if (err) throw err;
                console.log("Inserting Teacher: :LeroySalih@bisak.org");
            })

            dbConn.query(`INSERT INTO pods (title, baseUrl, lessonId, moduleId, podOrder)
                          VALUES('Test Pod 1', 'http://github.io', 'l1', 'm1', 1) 
            `, (err, result) => {
                if (err) throw err;
                console.log("Inserting Pod: :Test Pod 1");
            })

        
            dbConn.end();
            console.log('Disconnected')

        });

    } catch (error) {
        console.log(error.message);
        if (mySession.xSession)
            mySession.xSession.close()
    }
    
    
}

main()
