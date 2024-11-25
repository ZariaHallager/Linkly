var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var methodOverride = require('method-override');

require('dotenv').config();
require('./config/database');
require('./config/passport');

const chatRoutes = require('./routes/chatRoutes');
const eventRoutes = require('./routes/eventRoutes');
const followupRoutes = require('./routes/followupRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/chats', chatRoutes);
app.use('/events', eventRoutes);
app.use('/followups', followupRoutes);
app.use('/users', userRoutes);


var app = express();

// view engine setup


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
    res.locals.user = req.user
    next()
});

app.use('/', indexRouter);
app.use('/journal', journalRouter);

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

// Add this middleware BELOW passport middleware
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
