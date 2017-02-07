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

module.exports = function(app){
	app.post('/dummies/:test', function(req, res){
		console.log(req.body);
		console.log(req.params.test);
	});

  app.get('/', controllers.controller_template.index);
  app.get('/ajax_test', controllers.controller_template.ajax_test);
	app.get('/test', controllers.controller_template.test);
  app.get('/display_events', controllers.controller_template.display_events);

  app.post('/registration', controllers.controller_template.registration);
  app.post('/login', controllers.controller_template.login);
}
