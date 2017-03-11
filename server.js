//modules
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mysql = require("mysql");
//var bcrypt = require("bcryptjs");
var session = require("express-session");
var crypto = require("crypto");
var app = express();
var port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, '/client')));
app.set('views', path.join(__dirname, './server'));
app.set('view engine', 'ejs');

app.use(session({
  secret: crypto.randomBytes(48).toString("hex"),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true}
}));

app.use(function(req, res, next) {
	const origin = req.get("origin");
	res.header("Access-Control-Allow-Origin", origin);
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

require('./server/config/db.js');
require('./server/config/routes.js')(app);
var hourlyLoop = require("./server/config/hourlyLoop.js");

//run every hour
setInterval(hourlyLoop, 3600000);

//to debug timed events
//hourlyLoop(true);

var server = app.listen(port, function() {
	console.log("listening on port", port);
});
