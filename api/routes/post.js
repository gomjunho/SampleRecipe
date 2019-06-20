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
    var sql = 'SELECT p.id, p.title, u.displayName, p.hit, p.created FROM post p, users u WHERE p.user = u.id';
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
    conn.query(sql, [id], function(err, selectPostResults){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            if(selectPostResults.length > 0){
                console.log(selectPostResults[0].hit);
            
                var hit = parseInt(selectPostResults[0].hit) + 1;
    
                var sql = 'UPDATE post SET hit=? WHERE id=?';
                conn.query(sql, [hit, id], function(err, hitUpdateResults){
                    if(err){
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        selectPostResults[0].hit = hit;
                        console.log(selectPostResults);
                        res.send(selectPostResults);
                    }
                });
            } else {
                res.send({code:01, msg:'there is no post'});
            }
        }
    });
});


router.put('/:id', function (req, res) {
    var id = req.params.id;
    var date = new Date();
    var title = req.body.title;
    var description = req.body.description;

    var sql = 'UPDATE post SET updated=?, title=?, description=? WHERE id=?';

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
    var created = new Date();
    var user = req.body.user;
    var title = req.body.title;
    var description = req.body.description;
    var hit = 0;
    var recommend = 0;

    var sql = 'INSERT INTO post (created, user, title, description, hit, recommend) VALUES (?,?,?,?,?,?)';

    conn.query(sql, [created, user, title, description, hit, recommend], function(err, results){
        if(err){
            if(err.errno == 1366){
                console.log("data type err");
            }
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(results);
            res.send(results);
        }
    });
});

router.delete('/:id', function (req, res) {
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
