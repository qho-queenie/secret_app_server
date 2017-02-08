//Controller template

//the following things enable this controller to access the models, and also to send html files as responses
var path = require("path");
var htmlPath = path.join(__dirname, "./../../client/");
var requireFolder = require("./../config/req_folder.js");
var models = requireFolder("models");
var crypto = require("crypto");

//when you call a model function it should return a value (usually an array, the result of a query)
//after that you can make the response here in the controller

module.exports = {
	test: function(req, res){
		console.log(req.sessionID, "controller function called successfully");
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
			console.log("ajax testing");
		// });
	},
	registration: function(req, res){
		models.model_template.registration(req, res, function(err, rows, fields){
			// console.log(req.body, "res.data from registration");
			console.log(rows);
			// res.json({id: rows.insertId});
			res.json(rows.insertId);
		});
	},

	login: function(req, res){
		models.model_template.login(req, res, function(err, rows, fields){
			// console.log(req.body, "res.data from login");
			// console.log(rows, "rows from controller login")
			// req.session.data = {};
			// if (rows.length > 0){
			// 	req.session.data.id = rows[0].id;
			// 	console.log(req.session, "session");
			// }
			var uk = crypto.randomBytes(48).toString("hex");
			console.log("unique_key:", uk);
			res.json({id: rows[0].id, unique_key: uk});
		});
	},

	display_events: function(req, res){
		models.model_template.display_events(req, res, function(err, rows, fields){
			// console.log(req.body, "res.body from display events controller");

			console.log("unique_key:", req.query);
			res.json(rows);
		});
	}
	}
