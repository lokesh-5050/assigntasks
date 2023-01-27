var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  database: 'assign',
  user: 'root',
  password: 'root123'
});
connection.connect(function (err) {
  if (err) {
    console.error(`Error connecting: + err.stack`)
    return
  }

  console.log(`Connected a id + connection.threadId`)
})

/* GET home page. */
router.get('/', function (req, res, next) {
  let sql = "SELECT *FROM users"
  connection.query(sql, (err, row) => {
    if (err) throw err;
    res.render('index', { title: 'Express'  , data:row});
  })
});

module.exports = router;
