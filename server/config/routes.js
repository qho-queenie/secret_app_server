var fs = require("fs");
var path = require("path");
var controllerPath = path.join(__dirname, "./../controllers");
var controllers = {};
var session = require("express-session");
// var mongoose = require('mongoose');
// var Content = mongoose.model('Content');

fs.readdirSync(controllerPath).forEach(function(file) {
  if(file.indexOf('.js') >= 0) {
    controllers[file.slice(0, (file.length - 3))] = require(path.join(controllerPath, file));
  }
});

routeFunctions = {
  get:{
    '/' : controllers.controller_template.index,
    '/ajax_test' : controllers.controller_template.ajax_test,
    '/display_events' : controllers.controller_template.display_events
  },
  post:
  {
    '/registration' : controllers.controller_template.registration,
    '/login' : controllers.controller_template.login
  }
};

function doForEveryRoute(req, res, callback)
{
  console.log("-----------------------------");
  console.log(`Route: ${req.path}`);
  console.log(`Session ID: ${req.sessionID}`);
  console.log("-----------------------------");
  console.log(callback);
  callback(req, res);
}

module.exports = function(app){
  app.get('*', function(req, res){
    //stuff for only get
    doForEveryRoute(req, res, routeFunctions.get[req.path]);
  });
  
  app.post('*', function(req, res){
    //stuff for only post
    doForEveryRoute(req, res, routeFunctions.post[req.path]);
  });
}
