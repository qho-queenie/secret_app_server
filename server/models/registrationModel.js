//template for a model file

var doQuery = require('../config/doquery_function.js');
//the doQuery function is available. it takes a string which is the query, and an optional callback function
//the callback function takes one argument, rows. it is an array returned from a successful query.
//the callback function is only called when the query is successful.
//the purpose of the callback function is to enable you to modify the results of the query.
//this is usually not necessary so 99% of the time you shouldn't need a callback at all.

var bcrypt = require("bcryptjs");

module.exports = {
	newUser: function(req, res, callback){
		console.log(req.body.pw1);
		var salt = bcrypt.genSaltSync(10);
		var hashedPW = bcrypt.hashSync(req.body.pw1, salt);
		doQuery("insert into users (first_name, last_name, email, password, phone, position, company, created_at, updated_at) values ('"+ req.body.first_name + "', '" + req.body.last_name + "', '" + req.body.email + "', '" + hashedPW + "', '" + req.body.phone + "', '" + req.body.position + "', '" + req.body.company + "', now(), now())", callback);
	},

	checkEmail: function(req, res, callback){
		doQuery("select id from users where users.email = '" + req.body.email + "'", callback);
	},

	get1User: function(req, res, sessionUserId, callback){
		var test = `select first_name from users where users.id = ${sessionUserId}`;
		doQuery(test, callback);
	}
}

