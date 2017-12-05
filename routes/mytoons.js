var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

updatedToons = getUpdatedToons();
function getUpdatedToons(){
    var allToons = new Array();
    var allToonsUrl = "http://comic.naver.com/webtoon/weekday.nhn";
    request(allToonsUrl, function(err, res, html){
        if(!err){
            var $ = cheerio.load(html);

            $(".thumb").has('.ico_updt').next().each(function() {
                var link = $(this);
                var toonName = link.text();
                var toonHref = link.attr('href');

                allToons[toonName]=toonHref;
                //connection.query("");

            });
        }
    });
    return allToons;
}

function getMyToons(id){
    var sql = "";
    connection.query('SELECT * FROM user u, user_toon_relation ur WHERE u.id=ur.user_id && id=?;');

}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('mytoons',{
        list : updatedToons
    });
});

module.exports = router;