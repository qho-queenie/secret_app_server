//template for a model file

//require these two things to be able to do queries
var connection = require('../config/mysql.js');
var doQuery = require('../config/doquery_function.js');
//the doQuery function is available. it takes a string which is the query, and an optional callback function
//the callback function takes one argument, rows. it is an array returned from a successful query.
//the callback function is only called when the query is successful.
//the purpose of the callback function is to enable you to modify the results of the query.
//this is usually not necessary so 99% of the time you shouldn't need a callback at all.

module.exports = {
	test: function(req, res, callback){
		console.log("model function called successfully");

		//you can make a query by calling your callback, which you write in the controller.
		doQuery("select * from users", callback);
	},

	registration: function(req, res, callback){
		console.log("model function for registration");
		var doQ = (`INSERT INTO users (first_name, last_name, email, phone, password, created_at, updated_at) VALUES("${req.body.first_name}", "${req.body.last_name}", "${req.body.email}", "${req.body.phone}", "${req.body.password}", NOW(), NOW())`);
		doQuery(doQ, callback);
		console.log(doQ);
	},

	login: function(req, res, callback){
		console.log("model function for login");
		var doQ1 = (`SELECT id FROM users WHERE email = "${req.body.email}" AND password = "${req.body.password}" LIMIT 1`);
		doQuery(doQ1, callback);
		console.log(doQ1);
	},

	display_events: function(req, res, callback){
		console.log("model function for display_events");
		doQuery("SELECT * FROM events where user_id = 3", callback);
	},

	delete_event: function(req, res, callback){
		console.log("model function for delete_event");
		doQuery(`DELETE FROM events WHERE id = ${req.query.id}`, callback);
	},

	add_new_event: function(req, res, callback){
		console.log("model function for add_new_event");
		console.log(req.body);
		console.log(req.session.data.id);
		console.log(req.session.data);
		doQuery(`INSERT INTO events (event_name, event_note, created_at, updated_at, user_id) VALUES ("${req.body.event_name}", "${req.body.event_note}", NOW(), NOW(), "${req.session.data.id}")`, callback);
	}
}
