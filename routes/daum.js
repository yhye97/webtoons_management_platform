var client = require('cheerio-httpcli');

var today = String(new Date).split(" ")[0].toLowerCase();
var daum = `http://webtoon.daum.net/data/pc/webtoon/list_serialized/${today}?timeStamp=1515819276574`;

client.fetch(daum, {}, function (err, $, res, body) {
    var data = JSON.parse(body);
    var list = data["data"];

    list.forEach(function(item, idx){
       //다음 오늘의 웹툰 아이디, 제목, 날짜
        console.log(item.id + ' ' + item.title + ' ' + item.weekday);
    });

});