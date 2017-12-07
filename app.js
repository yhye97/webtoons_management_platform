var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mysql      = require('mysql');
var cheerio = require('cheerio');
var request = require('request');
var index = require('./routes/index');
var users = require('./routes/users');
var mytoons = require('./routes/mytoons');
var passport = require('passport');
var setting = require('./routes/setting');
var session = require('express-session');
var toonviewer = require('./routes/toonviewer')

passport.serializeUser(function(user, done) {
    console.log('serialized');
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    console.log('deserialized');
    done(null, user);
});

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

connection = mysql.createConnection({
    host     : 'nomock.com',
    user     : 'ytmt',
    password : 'ytmt',
    port     : 3306,
    database : 'YTMT'
});

app.use(session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', index);
app.use('/users', users);
app.use('/mytoons', mytoons);
app.use('/setting', setting);
app.use('/toonviewer', toonviewer);

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




module.exports = app;