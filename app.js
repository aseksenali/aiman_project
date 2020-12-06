const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registerRouter = require('./routes/register')
const securityRouter = require('./routes/security')
const graphqlRouter = require('./routes/graphql')
const moviesRouter = require('./routes/movies')
const peopleRouter = require('./routes/people')
const flash = require('connect-flash')
const passport = require('passport')
const bodyParser = require('body-parser')
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "aiman secret" }));
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

function secured(req, res, next) {
    if (req.user) {
        return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect("/login");
}

function contributing(req, res, next) {
    if (req.user) {
        if (req.user.Role === 'contributing') {
            return next()
        }
    }
    req.session.returnTo = req.originalUrl
    res.send("Not enough rights")
}

function getContributing(req, res, next) {
    if (req.method === 'GET') {
        return contributing(req, res, next)
    }
    next()
}

function postContributing(req, res, next) {
    if (req.method === 'POST') {
        return contributing(req, res, next)
    }
    next()
}

app.use('/', indexRouter);
app.use('/register', registerRouter)
app.use('/users', usersRouter)
app.use('/', securityRouter);
app.use('/graphql', graphqlRouter)
app.use('/movies', moviesRouter);
app.use('/people', peopleRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
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
