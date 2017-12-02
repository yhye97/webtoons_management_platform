var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', {
        title: '니툰내툰',
        list: updatedToon
    });
});


module.exports = router;
