var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('mytoons');
});

module.exports = router;