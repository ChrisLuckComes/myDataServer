var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session')
var bodyParser = require('body-parser');
var cors = require('cors')
const cp = require('child_process')
var MongoStore = require('connect-mongo')(session)

var index = require('./routes/index');
var users = require('./routes/users');
var getExchangeRate = require('./routes/getExchangeRate')
var getWeather = require('./routes/getWeather')
var register = require('./routes/register')
var login = require('./routes/login')
var checkEmail = require('./routes/checkEmail')
var checkName = require('./routes/checkName')
var active = require('./routes/active')
var checkLogin = require('./routes/checkLogin')
var logout = require('./routes/logout')
var getQuestions = require('./routes/getQuestions')
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
app.use(cookieParser('key'));
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.cookieParser())
app.use(cors({
  credentials: true,
  origin: 'http://localhost:8081'
}))
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'key',
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60
  },
  store: new MongoStore({
    url: 'mongodb://127.0.0.1:27017/session' //将session存入数据库中
  })
}))

app.use('/', index);
app.all('*', function (req, res, next) {
  if (req.headers.origin == 'http://localhost:8081' || req.headers.origin == 'http://localhost:8800') {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  }
  next();
});

app.use('/users', users);
app.use('/getExchangeRate', getExchangeRate);
app.use('/getWeather', getWeather);
app.use('/register', register);
app.use('/login', login);
app.use('/checkEmail', checkEmail);
app.use('/checkName', checkName);
app.use('/active', active);
app.use('/checkLogin', checkLogin)
app.use('/logout', logout)
app.use('/getQuestions', getQuestions)
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
