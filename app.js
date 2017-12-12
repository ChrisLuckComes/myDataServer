var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
const cp = require('child_process')
var getExchangeRate = require('./routes/getExchangeRate');
var getWeather = require('./routes/getWeather')
const query = require('./pool')

/**
 * @description 爬出汇率数据写入数据库以供使用
 */
cp.exec(`python getExchangeRate.py`, (err, stdout, stderr) => {
  if (err) console.log('stderr', err);
  if (stdout) {
    var data = eval('(' + stdout + ')')
    var sql = 'truncate ExchangeRate;'
    for (var key in data) {
      sql += `insert into ExchangeRate values('${key}',${+data[key]});`
    }
    query(sql, null, (err, result, fields) => {
      if (err)
        throw err
      else
        console.log(result)
    })
  }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/getExchangeRate', getExchangeRate);
app.use('/getWeather', getWeather);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
