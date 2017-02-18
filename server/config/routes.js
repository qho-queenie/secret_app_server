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
    '/display_user' : controllers.controller_template.display_user,
    '/display_events' : controllers.controller_template.display_events,
    '/delete_event' : controllers.controller_template.delete_event,
    '/display_contacts' : controllers.controller_template.display_contacts,
    '/delete_contact' : controllers.controller_template.delete_contact,
    '/end_current_task' : controllers.controller_template.end_current_task
  },
  post:
  {
    '/registration' : controllers.controller_template.registration,
    '/login' : controllers.controller_template.login,
    '/add_new_event' : controllers.controller_template.add_new_event,
    '/add_new_contact' : controllers.controller_template.add_new_contact,
    '/start_task' : controllers.controller_template.start_task,
    '/start_task_sms' : controllers.controller_template.start_task_sms,
    '/add_contact_sms' : controllers.controller_template.add_contact_sms,
    '/alert_contact_sms' : controllers.controller_template.alert_contact_sms,
    '/sms_reply' : controllers.controller_template.sms_reply,
    '/edit_profile' : controllers.controller_template.edit_profile
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

  app.get('*.*', function(req, res){
    console.log(`file: ${req.path}`);
    res.sendfile(req.path);
  });

  app.get('*', function(req, res){
    //stuff for only get
    doForEveryRoute(req, res, routeFunctions.get[req.path]);
  });

  app.post('*', function(req, res){
    //stuff for only post
    doForEveryRoute(req, res, routeFunctions.post[req.path]);
  });
}
