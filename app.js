var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var cheerio = require('cheerio');
var request = require('request');
var index = require('./routes/index');
var users = require('./routes/users');
var mytoons = require('./routes/mytoons');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/mytoons', mytoons);

//app.use(express.static('views'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

updatedToon = new Array();

getUpdatedToons();

function getUpdatedToons(){

    var allToonsUrl = "http://comic.naver.com/webtoon/weekday.nhn";
    request(allToonsUrl, function(err, res, html){
        if(!err){
            var $ = cheerio.load(html);

            $(".thumb").has('.ico_updt').next().each(function() {
                var link = $(this);

                var toonName = link.text();
                var toonHref = link.attr('href');
                updatedToon[toonName]=toonHref;
            });

        }
    });
}




module.exports = app;