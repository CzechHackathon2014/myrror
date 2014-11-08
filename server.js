var express = require('express'),
	mongoose = require('mongoose'),
    usrManagement = require('./routes/usrManagement'),
    app = express(),
    passport = require('passport'),
    config = require("./server-config"),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    bodyParser = require('body-parser'),
    fs = require('fs');
    // methodOverride = require('method-override');

process.stdin.resume();//so the program will not close instantly
function exitHandler(options, err) {
	mongoose.connection.close();
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

var db = require('./db/mongo').db;

// Bootstrap models
var modelsPath = './schemas';
fs.readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

var pass = require("./pass");

app.use(cookieParser());
//app.use(bodyParser());

// app.use(session({
//   secret: 'You never find me out',
//   store: new mongoStore({
//     url: config.db,
//     collection: 'sessions'
//   }),
//   resave: true,
//   saveUninitialized: true
// }));

// app.use(passport.initialize());
// app.use(passport.session());

app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});


app.get('/api/login', usrManagement.postLogin);
app.get('/api/register', usrManagement.postRegister);

app.set('port', config.port);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});