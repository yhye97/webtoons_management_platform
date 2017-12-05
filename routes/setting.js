var express = require('express');
var router = express.Router();
require('../routes/mytoons');


router.get('/', function(req, res, next) {
    res.render('setting',{
        list : updatedToons
    });
});

module.exports = router;