var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

function getToonImages(toon_index, num, cb){
    var imageList = [];
    var toonUrl = "http://comic.naver.com/webtoon/detail.nhn?titleId=" + toon_index + "&no=" + num;

    request(toonUrl, function(err, res, html){
        if(!err){
            var $ = cheerio.load(html);
            var p = Promise.resolve();
            var eachs = $("div.wt_viewer > img").each(function(index, element) {
                p = p.then(function() {
                    var toonHref = $(element).attr('src');
                    imageList.push(toonHref);
                });
            });
            p.then(function(){
                cb(imageList);
            });
        }else{
            console.log("웹툰 이미지 못가져왔습니다.");
        }
    });
}

router.get('/:toon_index/:num',function(req,res){
    if(!req.isAuthenticated()){
        res.redirect('/');
        return;
    }
        getToonImages(req.params.toon_index, req.params.num, function(imageList){
            res.render('toonviewer',{
                title: "zzz",
                images: imageList
            });
        });

  //  })
});

module.exports = router;