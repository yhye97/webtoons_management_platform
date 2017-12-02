var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

allWebtoons = getAllToons();
function getAllToons() {
    var allWeeklyToonsUrl = "http://comic.naver.com/webtoon/weekday.nhn";
    allWebtoonJSONList = new Array();
    request(allWeeklyToonsUrl,function (err, res, html) {
        if(!err){
            var $ = cheerio.load(html);
            $(".thumb").each(function (i) {
                var week = $(this).parent().parent().prev().attr('class');
                var webtoon_link = "http://comic.naver.com" + $(this).children().first().attr('href');
                var thumb_link = $(this).children().first().children().first().attr('src');
                var name = $(this).next().text();

                var webtoon= {
                    name : name,
                    thum_link : thumb_link,
                    webtoon_link : webtoon_link,
                    week : week
                };
                webtoon_string = JSON.stringify(webtoon);
                //JSON으로 만든당.
                allWebtoonJSONList.push(webtoon_string);
            })
        }
    });
    return(allWebtoonJSONList);
}

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', {
        title: '니툰내툰',
        list: allWebtoons
    });
    
});


module.exports = router;
