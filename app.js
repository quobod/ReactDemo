var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    expressHbs = require('express-handlebars'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    passport = require('passport'),
    flash = require('connect-flash'),
    validator = require('express-validator'),
    MongoStore = require('connect-mongo')(session);

// path to the routers
var routes = require('./routes/index');
var userRoutes = require('./routes/users');
var userAdmin = require('./routes/admins');

// this express application
var app = express();

// MonogDB connection and the passport configuration
mongoose.connect('localhost:27017/myaccounts');
require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',  expressHbs({defaultLayout: 'layout', extename: '.hbs'}));
app.set('view engine', 'hbs');

// static resources
app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'anotherOneou812?',
    resave:false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 180 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

// use the routes
app.use('/', routes);
app.use('/admin', userAdmin);
app.use('/user', userRoutes);

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
    res.render('error',{error:err});
});

// set port
app.set('port', (process.env.PORT || 2226));

app.listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
});