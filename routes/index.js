var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();
var mysql      = require('mysql');
var passport = require('passport'),
    KakaoStrategy = require('passport-kakao').Strategy;

passport.use(new KakaoStrategy({
        clientID : 'bd2e610396fb7bbb84cf91a786b3cc72',
        callbackURL :'/auth/login/kakao/callback'
       // clientSecret : 'eUtJGtlLoCZJufevp3LKfDP0KOtZUV7R'
    },
    function(accessToken, refreshToken,params, profile, done){
        //사용자 정보는 profile에
        loginByThirdparty(accessToken, refreshToken, profile);

        console.log("(!)로그인 : " + profile._json.id+"("+profile._json.properties.nickname +")");
        //return done(null,profile)
        return done(null, {
            'user_id': profile._json.id,
            'nickname': profile._json.properties.nickname
        });
    }
));

// kakao 로그인
router.get('/auth/login/kakao',
   // passport.authenticate('kakao',{state: "myStateValue"})
   passport.authenticate('kakao')
);

// kakao 로그인 연동 콜백
router.get('/auth/login/kakao/callback',
    passport.authenticate('kakao', {
        //session: false,
        successRedirect: '/mytoons',
        failureRedirect: '/'
    })
);

function loginByThirdparty(accessToken, refreshToken, profile) {
    var stmt_duplicated = 'INSERT INTO user(id) VALUES(?) ON DUPLICATE KEY UPDATE id=?;'

    connection.query(stmt_duplicated, [profile._json.id,profile._json.id] , function (err, result) {
        if (err) {
            console.log("로그인 쿼리중 에러 : " + err);
        } else {
            console.log("로그인 DB처리 완료!");
        }
    });
}

router.get('/auth/logout/kakao',function (req,res) {
    req.logout();
    res.redirect('/');
})

allWebtoons = new Array();

function getLatestToon(titleid, day ,cb) {
    var url = "http://comic.naver.com/webtoon/list.nhn?titleId=" + titleid+ "&weekday="+day;
    console.log(url);
        request(url, function (err, res, html) {
            if (!err) {
                var $ = cheerio.load(html);
                var latestLink = 'http://comic.naver.com';
                var latest;
                var t = $('#content > table > tbody > tr > td.title > a').first().each(function () {
                    latestLink += $(this).attr('href');
                    setTimeout(function () {},100);
                    latest = latestLink.split('?')[1].split('&')[1].split('=')[1];
                });

                var latestImage;
                $('#content > table > tbody > tr > td > a > img').first().each(function () {
                    latestImage = $(this).attr('src');
                    setTimeout(function () {},100);
                });

                cb({
                    latest: latest,
                    latestLink: latestLink,
                    latestImage: latestImage
                });

            } else {
                console.log("최신화 못가져왔습니다.");
                //throw err;
            }
        });
}

function getAllToons() {
    var allWeeklyToonsUrl = "http://comic.naver.com/webtoon/weekday.nhn";
    allWebtoonList = new Array();
    request(allWeeklyToonsUrl,function (err, res, html) {
        if(!err){
            var $ = cheerio.load(html);
            var p = Promise.resolve();
            var eachs = $(".thumb").each(function (i) {
                var week = $(this).parent().parent().prev().attr('class');
                var webtoon_link = "http://comic.naver.com" + $(this).children().first().attr('href');
                var thumb_link = $(this).children().first().children().first().attr('src');
                var name = $(this).next().text();
                var titleid = webtoon_link.split('?')[1].split('&')[0].split('=')[1];

                var webtoon= {
                    toon_index: titleid,
                    name : name,
                    thum_link : thumb_link,
                    webtoon_link : webtoon_link,
                    week : week,
                    latest : 0
                };

                allWebtoonList.push(webtoon);
            });
            p.then(function() {
                i = 0;
                allWebtoonList.forEach(function (webtoon) {
                    getLatestToon(webtoon.toon_index, webtoon.week, function (latest_toon) {
                        webtoon.latest = latest_toon.latest;
                        console.log(i + " = " + webtoon.name + " : " + webtoon.latest)
                        i++;
                        connection.query("INSERT INTO toon SET ? ON DUPLICATE KEY UPDATE latest=?",
                            [webtoon,webtoon.latest], function () {
                                if(err){
                                    console.log("웹툰 갱신중 에러!");
                                }
                            });
                    });
                })
            });
        }
    });
    allWebtoons = allWebtoonList;
}

getAllToons();
//처음 한번 수행
setInterval(getAllToons,5*60*1000);
//5분에 한번 수행

/* GET home page. */
router.get('/',
    function(req,res,next){
        if(req.isAuthenticated()){
            res.redirect('/mytoons');
            console.log("(!)이미 로그인");
        }else{
            console.log("(!)로그인세션 없음");
            res.render('index',{
                title: "니툰내툰",
                list: allWebtoons
            });
        }
    });

module.exports = router;
