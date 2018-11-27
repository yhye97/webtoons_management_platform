var express = require('express');
var router = express.Router();

function addMyToons(id,index,cb){
    connection.query("INSERT INTO user_toon_relation SET ?;",
        {user_id : id,toon_index : index, last : 1},function (err) {
            if(err) {
                throw err;
                console.log("내 웹툰 추가중 에러!")
            } else{
                //alert("추가되었습니다.")
                cb();
            }
        });
}

router.post('/toggle_toon',function(req,res,next){
    var index = req.body.toon_index;
    var id = req.user.user_id;

    connection.query("SELECT COUNT(*) FROM user_toon_relation WHERE user_id=? && toon_index=?",
        [id,index], function (err, rows,result) {
            if(err){
                console.log("내웹툰 등록중 에러!");
            }else{
                var count = rows[0]["COUNT(*)"];
                if(count>0){//이미 등록되어 있는 것이라면,
                    connection.query("DELETE FROM user_toon_relation WHERE user_id=? && toon_index=?;",
                        [id, index],function (err, rows, result) {
                            if(err) {
                                console.log("내 웹툰 제거중 에러!");
                                throw err;
                            }else{
                                //alert("제거되었습니다.")
                                res.redirect('/setting');
                        }
                    });
                }else{
                    addMyToons(id,index,function(){
                        res.redirect('/setting');
                    });
                }
            }
        });
});

function getMyToons(id,cb){
    var sqlquery = 'SELECT name, thum_link, webtoon_link, week, last FROM user u, user_toon_relation ur, toon t WHERE u.id=? && u.id=ur.user_id && t.toon_index=ur.toon_index;';
    var mylist = new Array();
    connection.query(sqlquery,id,function(err,rows,result){
        if(!err){
            mylist=rows;
            cb(mylist);
        }else{
            console.log("내 웹툰 리스트 가져오는데 실패했습니다!");
            //throw err;
        }
    });
}

router.get('/', function(req, res, next) {
    getMyToons(req.user.user_id,function (mytoons) {
        res.render('setting',{
            alltoons : allWebtoons,
            mytoons : mytoons
        });
    })
});

module.exports = router;