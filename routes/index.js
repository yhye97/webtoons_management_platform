var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();
var mysql      = require('mysql');
var passport = require('passport'),
    KakaoStrategy = require('passport-kakao').Strategy;

passport.use(new KakaoStrategy({
        clientID : '5cebedb504cf4d1aeeadff0b55f1589d',
        callbackURL :'http://localhost:3000/auth/login/kakao/callback',
        clientSecret : 'tUL5KhahqDPD8fvlSlbVdRY3C4WyblNq'
    },
    function(accessToken, refreshToken,params, profile, done){
        //사용자 정보는 profile에
        loginByThirdparty(accessToken, refreshToken, profile);

        console.log("(!)로그인 : " + profile._json.id+"("+profile._json.properties.nickname +")");
        return done(null, {
            'user_id': profile._json.id,
            'nickname': profile._json.properties.nickname
        });
    }
));

// kakao 로그인
router.get('/auth/login/kakao',
    passport.authenticate('kakao',{state: "myStateValue"})
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

var allWebtoons;

function getAllToons() {
    var allWeeklyToonsUrl = "http://comic.naver.com/webtoon/weekday.nhn";
    //connection.connect();
    allWebtoonJSONList = new Array();
    request(allWeeklyToonsUrl,function (err, res, html) {
        if(!err){
            var $ = cheerio.load(html);
            $(".thumb").each(function (i) {
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
                    week : week
                };
                webtoon_string = JSON.stringify(webtoon);

                connection.query("INSERT INTO toon SET ? ON DUPLICATE KEY UPDATE toon_index=toon_index",
                    webtoon);

                //JSON으로 만든당.
                allWebtoonJSONList.push(webtoon_string);
            })
        }
        //connection.end();
    });
    allWebtoons = allWebtoonJSONList;
}

getAllToons();
setInterval(getAllToons,5000);
//5초에 한번 수행

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
