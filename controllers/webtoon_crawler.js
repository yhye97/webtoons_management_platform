try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('../lib/spooky');
}

function crawler() {
    this.webtoonList = new Array();
    this.run = run;
}


function getEpisodeList(webtoonNum) {
    //spooky를 만든다
    var spooky = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    }, function (err) {
        if (err) {
            e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

        spooky.start("http://comic.naver.com/webtoon/list.nhn?titleId=650305");
        spooky.then(function () {
            var content = function() {
                var contentsList = new Array();
                var titleList = new Array();
                var list = document.querySelectorAll('#content > table > tbody > tr');
                for (i = 0; i < list.length; i++) {
                    tmp = list[i].querySelectorAll('td.title');
                    for(j=0;j<tmp.length;j++){
                        titleList.push(tmp[j].innerText);
                    }
                    //contentsList.push(list[i].querySelectorAll('td').innerText)
                }
                return titleList;
            }
            this.emit('list',this.evaluate(content));
            //#content > table > tbody
        });
        spooky.run();
    });

    spooky.on('title',function (title) {
        console.log('TITLE : ' + title);
    })

    spooky.on('list',function (titleList) {
        for(i=0;i<titleList.length;i++){
            console.log('-'+titleList[i]);
        }
        webtoonList.length=0;
        webtoonList=titleList;
    })

    spooky.on('console', function (line) {
        console.log(line);
    });

    spooky.on('error', function (e, stack) {
        console.error(e);

        if (stack) {
            console.log(stack);
        }
    });
}

function run() {
    //getEpisodeList();
    setTimeout(getEpisodeList,5000);
}

module.exports = crawler;

