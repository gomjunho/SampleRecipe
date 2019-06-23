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


/*
<comment data structure>

CREATE TABLE comment (
    id INT(11) unsigned NOT NULL AUTO_INCREMENT,
    root bigint(20) unsigned NOT NULL,
    re INT(1),
    user BIGINT(11),
    created DATETIME,
    updated DATETIME,
    comment mediumtext,
    PRIMARY KEY (id),
    CONSTRAINT FOREIGN KEY(root) REFERENCES post(id) ON DELETE CASCADE;
)

// root: 원글 ID
// re: 댓글 ID (없을 경우 depth 1/ 있을 경우 대댓글)


// 조회시 댓글의 양이 많아질 경우 속도 저하의 원인이 될 수 있다. => 덧글 테이블 따로 분리하고, 원글 ID를 Index로 관리 하면 해결
// DB에서 댓글을 링크드 리스트 형식으로 관리하면 좋을수 있지만 DB 접속을 여러번 해야하는 번거러움이 있다. => 원글 ID로 조회하여 한번에 글에 속한 댓글 조회 완료
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
    var sql = 'SELECT P.*, U.displayName FROM post P, users U WHERE P.user = U.id and P.id=?';

    conn.query(sql, [id], function(err, selectPostResults){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');

        } else {
            if(selectPostResults.length > 0){
                res.send({code:00, msg:'select post success', data: selectPostResults});

            } else {
                res.send({code:01, msg:'there is no post'});
            }
        }
    });
});

router.get('/:id/hit', function (req, res) {
    var id = req.params.id;
    var sql = 'UPDATE post SET hit=hit+1 WHERE id=?';
    conn.query(sql, [id], function(err, hitUpdateResults){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(hitUpdateResults);
            res.send(hitUpdateResults);
        }
    });

});



router.get('/:id/comment', function (req, res) {
    var id = req.params.id;

    console.log('comment get',id);

    var sql = 'SELECT C.id, C.root, C.re, C.user, U.displayName, C.created, C.updated, C.comment FROM comment C, users U WHERE C.user=U.id and C.root=?';
    conn.query(sql, [id], function(err, selectPostResults){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(selectPostResults);
        }
    });
});

router.post('/:id/comment', function (req, res) {
    var root = req.params.id;
    var re = req.body.re;
    var user = req.body.user.id;
    var created = new Date();
    var comment = req.body.comment;
    
    var sql = 'INSERT INTO comment (root, re, user, created, comment) VALUES (?, ?, ?, ?, ?)';
    conn.query(sql, [root, re, user, created, comment], function(err, selectPostResults){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(selectPostResults);
        }
    });
});

router.put('/:Pid/comment/:Cid', function (req, res) {
    var commentId = req.params.Cid;
    var comment = req.body.comment;

    var sql = 'UPDATE comment SET comment=? WHERE id=?';

    conn.query(sql, [comment, commentId], function(err, updateCommentResults){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(updateCommentResults);
            res.send(updateCommentResults);
        }
    });
});

router.delete('/:Pid/comment/:Cid', function (req, res) {
    var commentId = req.params.Cid;
    
    var sql = 'DELETE FROM comment WHERE id=?';
    conn.query(sql, [commentId], function(err, deletedCommentResults){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(deletedCommentResults);
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

router.get('/:id/recommend', function (req, res) {
    var id = req.params.id;

    var updateSQL = 'UPDATE post SET recommend=recommend+1 WHERE id=?';
    conn.query(updateSQL, [id], function(err, updatedResults){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log("updatedResults: ",updatedResults);
            // res.send(updatedResults);
            var selectSQL = 'SELECT recommend FROM post WHERE id=?';
            conn.query(selectSQL, [id], function(err, selectedResult) {
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');

                } else {
                    console.log("selectedResult: ", selectedResult);
                    res.send(selectedResult);
                }
            })


        }
    });
    /**
    var selectSQL = 'SELECT recommend FROM post WHERE id=?';

    conn.query(selectSQL, [id], function(err, selectedResults){
        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else {
            var newRecommend = selectedResults[0].recommend+1;

            var updateSQL = 'UPDATE post SET recommend=? WHERE id=?';
            conn.query(updateSQL, [newRecommend, id], function(err, updatedResults){
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    console.log(updatedResults);
                    res.send(updatedResults);
                }
            });

        }

    })
     */
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
