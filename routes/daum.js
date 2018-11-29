var client = require('cheerio-httpcli');
//월요일 웹툰
var mon='mon'
var daum = `http://webtoon.daum.net/data/pc/webtoon/list_serialized/${mon}?timeStamp=1515819276574`;

client.fetch(daum, {}, function (err, $, res, body) {
    var data = JSON.parse(body);
    var list = data["data"];

    list.forEach(function(item, idx){
       //다음 웹툰 아이디, 제목, 요일
        console.log(item.id + ' ' + item.title + ' ' + mon);
    });

});

//화요일 웹툰
var tue='tue'
var daum = `http://webtoon.daum.net/data/pc/webtoon/list_serialized/${tue}?timeStamp=1515819276574`;

client.fetch(daum, {}, function (err, $, res, body) {
    var data = JSON.parse(body);
    var list = data["data"];

    list.forEach(function(item, idx){
        //다음 웹툰 아이디, 제목, 요일
        console.log(item.id + ' ' + item.title + ' ' + tue);
    });

});

//수요일 웹툰
var wed='wed'
var daum = `http://webtoon.daum.net/data/pc/webtoon/list_serialized/${wed}?timeStamp=1515819276574`;

client.fetch(daum, {}, function (err, $, res, body) {
    var data = JSON.parse(body);
    var list = data["data"];

    list.forEach(function(item, idx){
        //다음 웹툰 아이디, 제목, 요일
        console.log(item.id + ' ' + item.title + ' ' + wed);
    });

});

//목요일 웹툰
var thu='thu'
var daum = `http://webtoon.daum.net/data/pc/webtoon/list_serialized/${thu}?timeStamp=1515819276574`;
client.fetch(daum, {}, function (err, $, res, body) {
    var data = JSON.parse(body);
    var list = data["data"];

    list.forEach(function(item, idx){
        //다음 웹툰 아이디, 제목, 요일
        console.log(item.id + ' ' + item.title + ' ' + thu);
    });

});

//금요일웹툰
var fri='fri';
var daum1 = `http://webtoon.daum.net/data/pc/webtoon/list_serialized/${fri}?timeStamp=1515819276574`;
client.fetch(daum1, {}, function (err, $, res, body) {
    var data = JSON.parse(body);
    var list1 = data["data"];

    list1.forEach(function(item, idx){
        //다음 웹툰 아이디, 제목, 요일
        console.log(item.id + ' ' + item.title + ' ' + fri);
    });

});

//토요일 웹툰
var sat='sat'
var daum = `http://webtoon.daum.net/data/pc/webtoon/list_serialized/${sat}?timeStamp=1515819276574`;

client.fetch(daum, {}, function (err, $, res, body) {
    var data = JSON.parse(body);
    var list = data["data"];

    list.forEach(function(item, idx){
        //다음 웹툰 아이디, 제목, 요일
        console.log(item.id + ' ' + item.title + ' ' + sat);
    });

});

//일요일 웹툰
var sun='sun'
var daum = `http://webtoon.daum.net/data/pc/webtoon/list_serialized/${sun}?timeStamp=1515819276574`;

client.fetch(daum, {}, function (err, $, res, body) {
    var data = JSON.parse(body);
    var list = data["data"];

    list.forEach(function(item, idx){
        //다음 웹툰 아이디, 제목, 요일
        console.log(item.id + ' ' + item.title + ' ' + sun);
    });

});