//Controller template

//the following things enable this controller to access the models, and also to send html files as responses
var path = require("path");
var htmlPath = path.join(__dirname, "./../../client/");
var requireFolder = require("./../config/req_folder.js");
var models = requireFolder("models");

//when you call a model function it should return a value (usually an array, the result of a query)
//after that you can make the response here in the controller

module.exports = {
	test: function(req, res){
		console.log("controller function called successfully");

		//response inside callback
		// models.model_template.test(req, res, function(){
			res.send("successfully made it through route->controller->model->response");
		// });
	},

	index: function(req, res){
		//response inside callback
		// models.model_template.test(req, res, function(){
			res.render('/index.html');
		// });
	},

	ajax_test: function(req, res){
		// models.model_template.test(req, res, function(){
			res.json({ajax_test1 : "ajax_test1", ajax_test2 : "ajax_test2"});
		// });
	}
	}
