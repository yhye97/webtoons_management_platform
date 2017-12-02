var express = require('express');
var router = express.Router();
var app = require('../app');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: '니툰내툰',
        list: ['1','2', '3']
    });
});


module.exports = router;
