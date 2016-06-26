var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var fs = require('fs');
var routes = require('./routes/index');
var users = require('./routes/users');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
//var http = require('http').Server(app);

var app = express();
var usrlog = ('./routes/userlog.js');
var dbfile = 'db.sk';
var configuration = JSON.parse(fs.readFileSync(dbfile));

var fbfile= 'fb.sk';
var fbconfig = JSON.parse(fs.readFileSync(fbfile));





///// Passport
passport.serializeUser(function(user,done){
    done(null,user);
});
passport.deserializeUser(function(obj,done){
   done(null,obj); 
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'img','favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret : 'provaprovaprovaprova',
                 resave: false,
                 saveUninitialized: true
                    }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());


var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 100,
    host :  configuration.database,
    user : configuration.username,
    password :configuration.password,
    database : configuration.db,
    debug : false,
    dateStrings :true,
    multipleStatements : true
});

app.use(function(req,res,next){
   req.pool = pool;
    next();
});



////// FINE SOCKET IO

/////// PASSPORT
passport.use(new FacebookStrategy({
    clientID : fbconfig.api_key,
    clientSecret : fbconfig.api_secret,
    callbackURL : fbconfig.callback
},
  function(token, refreshToken, profile, done){
                     pool.getConnection(function(err,connection){
                    var fbLogin = "select * from Utenti where UTE_FB_ID = "+profile.id;
                    connection.query(fbLogin,function(err, risp){
                            if (!risp.length){
                                var insquery = "INSERT INTO Utenti set UTE_FB_ID = "+ profile.id;

                connection.query(insquery, function (err,ris1) {
                    if(!err){
                        connection.query(fbLogin,function(err, usr2){
                            connection.release();
                            return done(null,profile);

                        });
                    }
                });
                            }
                            else{
                                connection.release();
                                return done(null,profile);
                            }
                    });
                        
                    
    }
                     )}

                                       ));                                     
                                 
        
        app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/facebookcall',

  passport.authenticate('facebook', {failureRedirect :'/login'}),function(req,res){
    res.redirect('/fblogin');
}
 );
////// FINE PASSPORT


app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {app, pool};
