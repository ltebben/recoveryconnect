var env = require('./env')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var api = require('./api')

var app = express();

// Connect to DB
mongoose.connect(env.MONGO_URL, function(err){
  if(err){
    console.log(`mongo had an error :(. error was : ${err}`);
  }else {
    console.log('no errors in mongo connection!');
  }
})
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: env.SECRET
}));
//load style preprocessing middleware
app.use(require('node-sass-middleware')({
  root: path.join('public','stylesheets'),
  src: 'scss',
  dest: '.',
  debug: true,
  outputStyle: 'compressed',
  force: true,
  error:function(err){
    console.log("Sass compilation error: " + err);
  }
}));

app.use(/\/api/,api);

app.get(/^\/?([a-z0-9-_]*)\/?$/i,function(req,res){
  var targetUrl = req.params[0];
  
  res.render(`${targetUrl}`,{
    "title": targetUrl
  });

});


app.use(express.static(path.join(__dirname, 'public')));


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
