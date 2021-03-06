var fs = require("fs");
var path = require("path");
var controllerPath = path.join(__dirname, "./../controllers");
var controllers = {};
var session = require("express-session");
var nodemailer = require(path.join(__dirname, "./../config/emailer.js"));
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
    '/end_current_task' : controllers.controller_template.end_current_task,
    '/remove_declined_contacts' : controllers.controller_template.remove_declined_contacts,
    '/get_current_timer' : controllers.controller_template.get_current_timer,
    '/check_contact_availability' : controllers.controller_template.check_contact_availability,
    '/get_all_available_contacts' : controllers.controller_template.get_all_available_contacts
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
    '/edit_profile' : controllers.controller_template.edit_profile,
    '/retrieve_password' : controllers.controller_template.retrieve_password
  }
};

function doForEveryRoute(req, res, callback)
{
  console.log("-----------------------------");
  console.log(`Route: ${req.path}`);
  console.log(`Session ID: ${req.sessionID}`);
  console.log("-----------------------------");
  console.log(callback);
  try{
    if(callback){
      callback(req, res);
    }
    else{
      console.log("Route doesn't exist.");
    }
  }catch(e){

    console.log(e);

    function exceptionEmail(email){
    var mailOptions = {
          from: '"USafe? app" <noreply.usafe@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "USafe? server exception", // Subject line
          text: '', // plaintext body
          html: `<b>Server exception occurred.</b><br><b>route:</b> ${req.path}<br><br><b>exception:</b><br>${e}`// html body
      };
      nodemailer.sendMail(mailOptions, function(error, info){
          if(error){
              return console.log(error);
          }
          else{
            res.sendStatus(200);
          }
        });
    }

    exceptionEmail("qho.queenieho@gmail.com");
    exceptionEmail("chris.rollins.dev@gmail.com");
  }
}

module.exports = function(app){

  app.get('*.*', function(req, res){
    console.log(`file: ${req.path}`);
    res.sendFile(req.path);
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
