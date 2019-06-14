var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');

router.use(cookieParser());

var products = {
    1:{title: "nodeJS"},
    2:{title: "javascript"}
}

router.get('/', function(req, res){
    
    if (req.cookies.count){
        var count = parseInt(req.cookies.count) + 1;
    } else {
        var count = 1;
    }
    res.cookie('count', count);
    res.send('count : ' + count);
});

router.get('/products', function(req, res){
    var output = "<h1> Products </h1>";
    output += "<ul>";
    for (idx in products) {
        output += `<li> ${products[idx].title} </li>`;
    }
    output += "</ul>";
    res.send(output);
});


/** cart signed cookies */
router.get('/cart', function(req, res){
    if(req.cookies.cart){
        var cart = req.cookies.cart;
        if(req.cookies.cart.length == 0){
            res.send('상품이 없음');
        } else {
            var output = "<h1> Products </h1>";
            output += "<ul>";
            for (idx in products) {
                output += `<li> <a href=cart/${idx}>${products[idx].title}</a> (${cart[idx]})</li>`;
            }
            /**
            
            (${cart[idx]})
             */
            output += "</ul>";
            res.send(output);
        }
    } else {
        var cart = {};
    }




});

router.get('/cart/:id', function(req, res){
    // req.cookies[products]
    var id = req.params.id;
    if (req.cookies.cart){
         var cart = req.cookies.cart;
    } else {
        var cart = {};
    }

    cart[id] = parseInt(cart[id]) + 1;

    res.cookie('cart', cart);
    // res.send('cart' + cart[id]);
    res.redirect('/api/cookie/cart');
});

module.exports = router;