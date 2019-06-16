var express = require('express');
var session = require('express-session');
var pbkdf2 = require('pbkdf2-password');
var MySQLStore = require('express-mysql-session')(session);
// var FileStore = require('session-file-store')(session);

var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var router = express.Router();

var hasher = pbkdf2();
// var app = express();

var mysql = require('mysql');

var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'lljh0802@W',
  database : 'realestate'
});

conn.connect();


// router.use(bodyParser.urlencoded({extended: false}));
router.use(session({
    secret: 'asdfa1!#11311',
    resave: false,
    saveUninitialized: true,
    // store: new FileStore(),
    store: new MySQLStore({
        host:'localhost',
        port:3306,
        user:'root',
        password:'lljh0802@W',
        database:'realestate'
    })
}))

router.use(passport.initialize());
router.use(passport.session());

var passportFacebook = require('passport-facebook');

// var users = [{authId:'facebook:1890424657725031', username:'junho', password:'1234', displayName:'jun'}]

passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.authId);
});

passport.deserializeUser(function(id, done){
    console.log('deserializeUser', id);

    var sql = 'SELECT * FROM users WHERE authId = ?';
    conn.query(sql, [id], function(err, results){
        var user = results[0];
        done(null, user);
    })


});

passport.use(
    new LocalStrategy(function(username, password, done){

        console.log('localstorategy');

        var uname =username;
        var pwd = password;

        console.log('passport uname', username);
        console.log('passport pwd', password);
        
        var sql = 'SELECT * FROM users WHERE username = ?';
        conn.query(sql, [uname], function(err, results){
            if (results.length > 0) {
                var user = results[0];
                if(err){
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    hasher({password:pwd, salt: user.salt}, function(err, pass, salt, hash){
                        if(hash === user.password){
                            console.log('ok',user);
                            done(null, user, {message:'correct'});
                        } else {
                            console.log('fail',user);
                            done(null, false, {message:'no match password'});
                        }
                    })
                }
            } else {
                done (null, false, {message:'no match user'});
            }
        });
    })
)


passport.use(new FacebookStrategy({
    clientID: "440936410070583",
    clientSecret: "4bcb576e648c65228efb282ba6774cb7",
    callbackURL: "http://localhost:8081/api/login/facebook/callback", 
    profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("profile", profile);

    var user = {
        authId: 'facebook:'+profile.id,
        username : profile.username,
        displayName : profile.displayName,
        email : profile.emails[0].value
    };

    var sql = 'select * from users where authId=?'

    conn.query(sql, [user.authId], function(err, results){
        // not found

        if(err){
            console.log(err);
            res.status(500).send('Internal Server Error');

        } else if(results.length > 0){
            var user = results[0];
            console.log('ok',user);
            done(null, user, {message:'correct'});

        } else {
            var sql = 'INSERT INTO users (authId, username, displayName, email) values (?,?,?,?)'
            conn.query(sql, [user.authId, user.username,  user.displayName, user.email], function(err, results){
                console.log(results);
                if (err) {
                    console.log(err);
                    // res.status(500).send('Internal Server Error');

                } else {
                    console.log('session user', user);
                    done (null, user, {message:'create user data'});

                }
            })
        }
    });    
  }
));


// app.get('/welcome', function(req, res){
//    if (req.user.displayName) {
//         var result = `
//         <h1>Hello, ${req.user.displayName}</h1>
//         <a href="/auth/logout">logout</a>
//         `;
//    } else {
//        var result = `
//        <h1>Please Login</h1>
//        <a href= "/auth/login">Login</a>
//        `;
//    }
//    res.send(result);
// });



// face book guide code
// <script>
//   window.fbAsyncInit = function() {
//     FB.init({
//       appId      : '{your-app-id}',
//       cookie     : true,
//       xfbml      : true,
//       version    : '{api-version}'
//     });
      
//     FB.AppEvents.logPageView();   
      
//   };

//   (function(d, s, id){
//      var js, fjs = d.getElementsByTagName(s)[0];
//      if (d.getElementById(id)) {return;}
//      js = d.createElement(s); js.id = id;
//      js.src = "https://connect.facebook.net/en_US/sdk.js";
//      fjs.parentNode.insertBefore(js, fjs);
//    }(document, 'script', 'facebook-jssdk'));
// </script>

router.get('/session', function(req,res){
    console.log('req user',req.user);
    res.send(req.user);
})


// router.post('/register', function(req,res){
//     var newUser = {
//         authId : 'local:'+req.body.user.authId,
//         username : req.body.user.username,
//         password : req.body.user.password,
//         displayName : req.body.user.displayName,
//         email : req.body.user.email
//     }
//     hasher({password: newUser.password}, function(err, pass, salt, hash){
//         var sql = 'INSERT INTO users (authId, username, password, salt, displayName, email) values (?,?,?,?,?,?)'
//         conn.query(sql, [newUser.authId, newUser.username, hash, salt, newUser.displayName, newUser.email], function(err, results){
//             if(err){
//                 if(err.errno === 1062){
//                     res.send({code:1, msg:'alreay exist'});
//                 } else {
//                     console.log(err);
//                     res.status(500).send('Internal Server Error');
//                 }
//             } else {
//                 console.log(results);
//                 req.login(newUser, function(err) {
//                     if (err) {
//                         return next(err); 
//                     } else {
//                         res.send({code:0, msg:'succ', result:results});
//                     }
//                 });
//             }
//         })
//     })
// })

  router.get('/temp', function(req, res){
    res.send(req.user);

    // req.logout();
    // req.session.save(function(){
    //     res.send('logout', req.user);
    // });
  });

router.post('/', passport.authenticate('local', 
    { 
        // successRedirect: '/succ',
        // failureRedirect: '/fail',
        // successRedirect: '/welcome',
        // failureRedirect: '/examples/login',
        failureFlash: false 
    }), function(req, res){
        res.send(req.user);
    }
)

// router.post('/', function(req, res){
//     console.log(req.body);
//     hasher({hash:req.body.password, salt: req.body.salt}, function(err, pass, salt, hash){
//         res.send(pass, salt, hash);
//     })
// });

// router.post('/', function(req, res){
//     console.log(req.body);
//     res.send(req.body);
// })

router.get('/facebook', passport.authenticate('facebook', {scope:'email'}));


router.get('/facebook/callback',
    passport.authenticate('facebook', 
    {
        // successRedirect: '/welcome',
        // failureRedirect: '/auth/login'
    }),
    function(req, res){
        res.send(req.user);
    }
);



router.delete('/', function(req, res){
    req.logout();
    req.session.save(function(){
        res.send('logout');
    //   res.redirect('/examples/login');
    });
});

module.exports = router;
