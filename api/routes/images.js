
var express = require('express');
var multer = require('multer');
var router = express.Router();

/* 
CREATE TABLE user (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  email varchar(32),
  nickname varchar(32),
  password varchar(32),
  PRIMARY KEY (email)
)

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



//npm install --save gm
//sudo apt-get install graphicsmagick

/**
 * 출처: http://webframeworks.kr/tutorials/expressjs/expressjs_file_upload/
 */


 /* // 썸네일 이미지
 * gm('image.jpg')
    .thumb(100, 100, 'imgs/thumb.jpg', function (err) {
      if (err) console.error(err);
      else console.log('done - thumb');
    });

    // 메타데이터 제거
    gm('image.jpg')
    .noProfile()
    .write('noprofile.jpg', function (err) {
      if (err) console.error(err);
      else console.log('done - noprofile');
    });

    // 블러이미지 만들기
    gm('image.jpg')
    .blur(19, 10)
    .write('blur.jpg', function (err) {
      if (err) console.error(err);
      else console.info('done - blur')
    });

    // 리사이징
    gm('image.jpg')
  .resize(100, 200)
  .write('100_200.jpg', function (err) {
    if (err) console.error(err)
    else console.log('done')
  });
 */



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
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
  var sql = 'SELECT * FROM diary';
  conn.query(sql, function(err, results){
    if(err){
      console.log(err);
      res.status(500);
    } else {
      res.send(results);
    }
  });
});

router.put('/:id', function (req, res) {
  console.log('image put call!!');
  res.send('image put call!!');

});

/******************************************
 * delete specific image file
 ******************************************/
router.delete('/:id', function (req, res) {
  console.log('image delete call!!');
  res.send('image delete call!!');
});

// upload.single('file'),
router.post('/',  function (req, res) {
/*
  res.send('Uploaded! : '+req.file.filename); // obejct를 리턴함
  console.log(req.file.filename); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
*/

  /*******  diary data structure  *********

  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  user varchar(32),
  date varchar(32),
  visible varchar(1),
  data1 varchar(32),
  data2 varchar(32),
  data3 varchar(32),
  data4 varchar(32),
  data5 varchar(32),
  image varchar(32)

  ******************************************/

  if (req.file) {
    var filename = req.file.filename;
  } else {
    var filename = "";
  }
  console.log("req file: ", req.file);
  
  console.log("filename: ", filename);
  var sql = 'INSERT INTO images (id, userid, date, filename) VALUES (?,?,?,?)';
  res.send(req.file);

  //res.send(user, date, visible, data1, data2, data3, data4, data5, req.file.filename);
  
  /**
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


module.exports = router;
