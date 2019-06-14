var express = require('express');
var multer = require('multer');
var router = express.Router();


/* 

CREATE TABLE diary (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user varchar(32),
  date varchar(32),
  visible varchar(1),
  data1 varchar(32),
  data2 varchar(32),
  data3 varchar(32),
  data4 varchar(32),
  data5 varchar(32),
  image varchar(32),
  PRIMARY KEY (id)
)
*/


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
  }
})

var upload = multer({ storage:storage })

var bodyParser = require('body-parser');
var mysql = require('mysql');

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'lljh0802@W',
  database : 'fivepieces'
});

conn.connect();

router.use(bodyParser.json());


/*
put : edit
post : create
*/

// all or week/month term data get
router.get('/', function (req, res) {
  // from date and to date entered
  if (req.query.from && req.query.to) {
    console.log("from", req.query.from);
    console.log("to", req.query.to);
    var sql = 'SELECT * FROM diary WHERE ? <= date and date <= ?';
    conn.query(sql, [req.query.from, req.query.to], function(err, results){
      if(err){
        console.log(err);
        res.status(500);
      } else {
        res.send(results);
      }
    });
  // all data select
  } else {
    

console.log("user", req.body.user);
    var user = req.body.user;
    var date = req.body.date;
    var visible = req.body.visible;
    var data1 = req.body.data1;
    var data2 = req.body.data2;
    var data3 = req.body.data3;
    var data4 = req.body.data4;
    var data5 = req.body.data5;
    /**
    if (req.file) {
      var filename = req.file.filename;
    } else {
      var filename = "";
    }
     */
    console.log(user, date, visible, data1, data2, data3, data4, data5);

    var sql = 'SELECT * FROM diary';
    conn.query(sql, function(err, results){
      if(err){
        console.log(err);
        res.status(500);
      } else {
        res.send(results);
      }
    });
  }
});


router.get('/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'SELECT * FROM diary WHERE id=?';
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
});


router.put('/:id', function (req, res) {

  var id = req.params.id;
  
  var user = req.body.user;
  var date = req.body.date;
  var visible = req.body.visible;
  var data1 = req.body.data1;
  var data2 = req.body.data2;
  var data3 = req.body.data3;
  var data4 = req.body.data4;
  var data5 = req.body.data5;
  if (req.file) {
    var filename = req.file.filename;
  } else {
    var filename = "";
  }
  var sql = 'UPDATE diary SET user=?, date=?, visible=?, data1=?, data2=?, data3=?, data4=?, data5=?, image=? WHERE id=?';
  console.log(id, user, date, visible, data1, data2, data3, data4, data5, filename);
  conn.query(sql,
    [user, date, visible, data1, data2, data3, data4, data5, filename, id],
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

// upload.single('file'),
router.post('/', upload.single('file'), function (req, res) {
//console.log(req.file);

  var user = req.body.user;
  var date = req.body.date;
  var visible = req.body.visible;
  var data1 = req.body.data1;
  var data2 = req.body.data2;
  var data3 = req.body.data3;
  var data4 = req.body.data4;
  var data5 = req.body.data5;
  if (req.file) {
    var filename = req.file.filename;
  } else {
    var filename = "";
  }
  console.log(user, date, visible, data1, data2, data3, data4, data5, filename);

  var sql = 'INSERT INTO diary (user, date, visible, data1, data2, data3, data4, data5, image) VALUES (?,?,?,?,?,?,?,?,?)';

  /*
  conn.query(sql,
           [user, date, visible, data1, data2, data3, data4, data5, filename],
           function(err, results){
    if(err){
      console.log('err: ' + err);
      //console.log(err);
      res.send(err);
      res.status(500).send('Internal Server Error');
    } else {
      //  res.render('view', {topics:topics, topic:topic[0]});
      res.send(results);
      console.log(results);
    }
  });
   */
  
});

router.delete('/:id', function (req, res) {
  console.log('delete api call!!');

  var id = req.params.id;
  var sql = 'DELETE FROM diary where id=?';

  console.log('input id :' + id);
  console.log('sql :' + sql);

  conn.query(sql,
           [id],
           function(err, results){
    if(err){
      console.log('err: ' + err);
      //console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      //  res.render('view', {topics:topics, topic:topic[0]});
      res.send(results);
      console.log(results);
    }
  });
});

module.exports = router;
