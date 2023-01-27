var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'sakila',
    user: 'root',
    password: 'root123'
});
connection.connect(function (err) {
    if (err) {
        console.error(`Error connecting: + err.stack`)
        return
    }

    console.log(`Connected as id + connection.threadId`)
})
connection.query('SELECT * FROM city', function (error, results, fields) {
    if (error)
        throw error;
    results.forEach(result => {
        console.log(result);
    });
});