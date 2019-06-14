var express = require('express');
var router = express.Router();

// var session = require('express-session');
// var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var mysql = require('mysql');

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'lljh0802@W',
  database : 'realestate'
});

conn.connect();

router.use(bodyParser.json());

router.get('/', function (req, res) {
    var sql = 'SELECT * FROM users';
    conn.query(sql, function(err, results){
      if(err){
        console.log(err);
        res.status(500);
      } else {
        res.send(results);
      }
    });
});


router.get('/:id', function (req, res) {
//console.log("test!!!");
    var sql = 'SELECT * FROM users';

  conn.query(sql, function(err, results){
    var id = req.params.id;
    if(id){
      var sql = 'SELECT * FROM users WHERE id=?';
      conn.query(sql, [id], function(err, results){
        if(err){
          console.log(err);
          res.status(500).send('Internal Server Error');
        } else {
        //  res.render('view', {topics:topics, topic:topic[0]});
          res.send(results);
          console.log(results);
        }
      });
    } else {
      // res.render('view', {topics:topics});
          res.send(results);
          console.log(results);
    }
  });
});


router.put('/:id', function (req, res) {

  var id = req.params.id;
  var user = req.body.user;
  var sql = 'UPDATE users SET authId=?, username=?, password=?, salt=?, displayName=?, email=? WHERE id=?';

  conn.query(sql,
           [user.authId, user.username, user.password, user.salt, user.displayName, user.email, id],
           function(err, results){
    if(err){
      console.log('err: ' + err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(results);
      console.log(results);
    }
  });
});


router.post('/:id', function (req, res) {

  var user = req.body.user;
  var sql = 'INSERT INTO users (id, authId, username, password, salt, displayName, email ) VALUES (?,?,?,?,?,?,?)';

  conn.query(sql,
           [user.id, user.authId, user.username, user.password, user.salt, user.displayName, user.email],
           function(err, results){
    if(err){
      console.log('err: ' + err);
      res.send(err);
      res.status(500).send('Internal Server Error');
    } else {
      //  res.render('view', {topics:topics, topic:topic[0]});
      res.send(results);
      console.log(results);
    }
  });
});

router.delete('/:id', function (req, res) {

  var id = req.params.id;
  var sql = 'DELETE FROM users where id=?';

  conn.query(sql,
           [id],
           function(err, results){
    if(err){
      console.log('err: ' + err);
      res.status(500).send('Internal Server Error');
    } else {
      //  res.render('view', {topics:topics, topic:topic[0]});
      res.send(results);
      console.log(results);
    }
  });
});

module.exports = router;
