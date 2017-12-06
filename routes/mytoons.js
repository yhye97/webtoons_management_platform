var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var async = require('async');
var router = express.Router();

function getUpdatedToons(cb){
    var allToons = new Array();
    var allToonsUrl = "http://comic.naver.com/webtoon/weekday.nhn";
    request(allToonsUrl, function(err, res, html){
        if(!err){
            var $ = cheerio.load(html);
            var p = Promise.resolve();
            var eachs = $(".thumb").has('.ico_updt').next().each(function() {
                p = p.then(function() {
                    var link = $(this);
                    var toonName = link.text();
                    var toonHref = link.attr('href');

                    allToons[toonName] = toonHref;
                    //connection.query("");
                });
            });
            p.then(function(){
                cb(allToons);
            });
        }else{
            console.log("업데이트 웹툰 못가져왔습니다.");
            throw err;
        }
    });
}

function getMyToons(id,cb){
    var sqlquery = 'SELECT name, thum_link, webtoon_link, week, last FROM user u, user_toon_relation ur, toon t WHERE u.id=? && u.id=ur.user_id && t.toon_index=ur.toon_index;';
    var mylist;
    connection.query(sqlquery,id,function(err,rows,result){
        if(!err){
            mylist=rows;
            cb(mylist);
        }else{
            console.log("내 웹툰 리스트 가져오는데 실패했습니다!");
            throw err;
        }
    });
}


/* GET home page. */
router.get('/', function(req, res, next) {
    async.series(
        [
        function(callback){
            getMyToons(req.user.user_id, function (mytoon_list) {
                callback(null,mytoon_list);
            });
        },
        function(callback){
            getUpdatedToons(function (updated_list) {
                callback(null,updated_list);
            });
        }
        ],
        function(err, results){
        console.log(results);
            res.render('mytoons', {
                mytoons: results[0],
                updatedtoons: results[1]
            });
        }
    );





});

module.exports = router;