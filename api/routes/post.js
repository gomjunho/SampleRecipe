/*
<post data structure>

// 에러 발생 원인 create, update, like 는 예약어라 컬럼명으로 사용 불가한듯
CREATE TABLE post (
id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
created datetime,
updated datetime,
user bigint(20),
title varchar(32),
description mediumtext,
hit INT(11) unsigned NOT NULL default '0',
recommend INT(11) unsigned NOT NULL default '0',
PRIMARY KEY (id)
);

추가 고려사항: 사용자 삭제시 어떻게 처리할 것인가? 사용자가 작성한 글 삭제? 탈퇴한 사용자로 표기?(우선 탈퇴표기로 구현) foreign key 생성하지 않음
 */


var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var mysql = require('mysql');


var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'lljh0802@W',
  database : 'SR'
});

conn.connect();

router.use(bodyParser.json());

router.get('/', function (req, res) {
    // pagenation
    // var page = req.query.page;
    
    // all posts
    var sql = 'SELECT * FROM post';
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
    var id = req.params.id;
    var sql = 'SELECT * FROM post WHERE id=?';
    conn.query(sql, [id], function(err, results){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(results);
            res.send(results);
        }
    });
});


router.put('/:id', function (req, res) {

    var id = req.params.id;
    var date = new Date();
    var title = req.body.title;
    var description = req.body.description;

    console.log('title' + title);
    console.log('description' + description);

    var sql = 'UPDATE post SET updated=?, title=?, description=? WHERE id=?';

    // UPDATE post SET title='ti33', description='de3333' WHERE id=3

    conn.query(sql, [date, title, description, id], function(err, results){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(results);
            res.send(results);
        }
    });
});


// update에 빈 문자열을 넣고 있는데 NULL 로 인식 하는지 확인 필요

router.post('/', function (req, res) {
    console.log('post create api call!!');
    
    var created = new Date();
    var updated = '';
    var user = req.body.user;
    var title = req.body.title;
    var description = req.body.description;
    var hit = 0;
    var recommend = 0;

    console.log(created.valueOf());
    // res.send(create);

    var sql = 'INSERT INTO post (created, updated, user, title, description, hit, recommend) VALUES (?,?,?,?,?,?,?)';

    conn.query(sql, [created, updated, user, title, description, hit, recommend], function(err, results){
        if(err){
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                console.log(results);
                res.send(results);
            }
    });
});

router.delete('/:id', function (req, res) {
    console.log('post delete api call!!');

    var id = req.params.id;
    var sql = 'DELETE FROM post where id=?';

    conn.query(sql, [id], function(err, results){
        if(err){
            console.log('err: ' + err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(results);
            console.log(results);
        }
    });
});

module.exports = router;
