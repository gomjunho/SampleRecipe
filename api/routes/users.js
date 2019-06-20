/**
<users data structure>

CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  authId varchar(50) NOT NULL,
  username varchar(30),
  password varchar(255),
  salt varchar(255),
  displayName varchar(50),
  email varchar(50) NOT NULL,
  PRIMARY KEY (id, authId)
);
 */

var express = require('express');
var router = express.Router();

var pbkdf2 = require('pbkdf2-password');

// var MySQLStore = require('express-mysql-session')(session);

// var session = require('express-session');
// var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var mysql = require('mysql');


var hasher = pbkdf2();

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'lljh0802@W',
  database : 'SR'
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

  var selectSQL = 'SELECT * FROM USERS WHERE id = ?';
  conn.query(selectSQL, [id], function(err, selectresults){
    if(err) {
      console.log(err);
      res.status(500).send('Internal Server Error');

    } else {
      var queryuser = selectresults[0];
      hasher({password: user.password, salt: queryuser.salt}, function(err, pass, salt, hash){
        
        console.log("user.password", user.password);
        console.log("hash", hash);
        console.log("queryuser.password", queryuser.password);

        // 비밀번호 확인
        if (hash === queryuser.password) {
          hasher({password: user.password}, function(err, pass, salt, hash){
            var updateSQL = 'UPDATE users SET authId=?, username=?, password=?, salt=?, displayName=?, email=? WHERE id=?';
            conn.query(updateSQL, [user.authId, user.username, hash, salt, user.displayName, user.email, id], function(err, updateresults){

              if(err){
                console.log('err: ' + err);
                res.status(500).send('Internal Server Error');

              } else {
                res.send({code:1, msg:updateresults});
                console.log(updateresults);
              }
            });
          })

        } else {
          res.send({code:0, msg:'password error'});
        }
      })


      /**
       hasher({password:pwd, salt: user.salt}, function(err, pass, salt, hash){
                        if(hash === user.password){
                            console.log('ok',user);
                            done(null, user, {message:'correct'});
                        } else {
                            console.log('fail',user);
                            done(null, false, {message:'no match password'});
                        }
                    })
       * 
       */
      // if(queryuser.password = hash)
    }
  })

//  hasher({password: user.password}, function(err, pass, salt, hash){
//   conn.query(sql, [user.authId, user.username, hash, salt, user.displayName, user.email, id], function(err, results){
//     if(err){
//       console.log('err: ' + err);
//       res.status(500).send('Internal Server Error');
//     } else {
//       res.send(results);
//       console.log(results);
//     }
//   });
// })





  
});


router.post('/', function (req, res) {

  // var user = req.body.user;
  console.log(req.body.user);
  var newUser = {
    authId : 'local:'+req.body.user.authId,
    username : req.body.user.username,
    password : req.body.user.password,
    displayName : req.body.user.displayName,
    email : req.body.user.email
  }
  hasher({password: newUser.password}, function(err, pass, salt, hash){
    var sql = 'INSERT INTO users (authId, username, password, salt, displayName, email) values (?,?,?,?,?,?)'
    conn.query(sql, [newUser.authId, newUser.username, hash, salt, newUser.displayName, newUser.email], function(err, results){
        if(err){
            if(err.errno === 1062){
                res.send({code:1, msg:'alreay exist'});
            } else {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
        } else {
            console.log(results);
            res.send(newUser);
            /** 
            req.login(newUser, function(err) {
                if (err) {
                    return next(err); 
                } else {
                    res.send({code:0, msg:'succ', result:results});
                }
            });
*/
        }
    })
  })
});


// var newUser = {
//   authId : 'local:'+req.body.user.authId,
//   username : req.body.user.username,
//   password : req.body.user.password,
//   displayName : req.body.user.displayName,
//   email : req.body.user.email
// }
// hasher({password: newUser.password}, function(err, pass, salt, hash){
//   var sql = 'INSERT INTO users (authId, username, password, salt, displayName, email) values (?,?,?,?,?,?)'
//   conn.query(sql, [newUser.authId, newUser.username, hash, salt, newUser.displayName, newUser.email], function(err, results){
//       if(err){
//           if(err.errno === 1062){
//               res.send({code:1, msg:'alreay exist'});
//           } else {
//               console.log(err);
//               res.status(500).send('Internal Server Error');
//           }
//       } else {
//           console.log(results);
//           req.login(newUser, function(err) {
//               if (err) {
//                   return next(err); 
//               } else {
//                   res.send({code:0, msg:'succ', result:results});
//               }
//           });
//       }
//   })
// })


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
