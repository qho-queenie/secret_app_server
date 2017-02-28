//template for a model file

//require these two things to be able to do queries
var connection = require('../config/mysql.js');
var doQuery = require('../config/doquery_function.js');
var crypto = require("crypto");
var nodemailer = require("../config/emailer.js");
//the doQuery function is available. it takes a string which is the query, and an optional callback function
//the callback function takes one argument, rows. it is an array returned from a successful query.
//the callback function is only called when the query is successful.
//the purpose of the callback function is to enable you to modify the results of the query.
//this is usually not necessary so 99% of the time you shouldn't need a callback at all.

module.exports = {
	test: function(req, res, callback){
		console.log("model function called successfully");

		//you can make a query by calling your callback, which you write in the controller.
		doQuery("SELECT * FROM users", callback);
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
		doQuery(`SELECT * FROM users JOIN events ON users.id = events.user_id WHERE events.user_id = ${req.session.data.id}`, callback);
	},

	display_user: function(req, res, callback){
		doQuery(`SELECT * FROM users where id = ${req.session.data.id}`, callback);
	},

	display_contacts: function(req, res, callback){
		console.log("model function for display_events");
		console.log(req.session.data);
		doQuery(`SELECT * FROM contacts where users_id = ${req.session.data.id}`, callback);
	},
	delete_event: function(req, res, callback){
		console.log("model function for delete_event");
		var doq = `DELETE FROM events WHERE id = ${req.query.id}`;
		doQuery(doq, callback);
		console.log(doq);
	},
	delete_contact: function(req, res, callback){
		console.log("model function for delete_contact");
		console.log(req.query.id, "id to be deleted")
		var doq = `DELETE FROM contacts WHERE id = ${req.query.id}`;
		doQuery(doq, callback);
		console.log(doq);
	},
	add_new_event: function(req, res, callback){
		console.log("model function for add_new_event");
		console.log(req.body);
		console.log(req.session.data.id);
		console.log(req.session.data);
		doQuery(`INSERT INTO events (event_name, event_note, created_at, updated_at, user_id) VALUES ("${req.body.event_name}", "${req.body.event_note}", NOW(), NOW(), "${req.session.data.id}")`, callback);
	},
	change_contact_status: function(status, crypto_code, callback){
		console.log("model function for change_contact_status");
		var doq = `UPDATE contacts SET contact_status = ${status} WHERE crypto_code = "${crypto_code}"`;
		console.log(doq, "doq from change_contact_status model");
		doQuery(doq, callback);
	},
	find_contact_by_phone: function(phone, callback){
		console.log("model function for find_contact_by_phone");
		doQuery(`SELECT id, contact_status FROM contacts WHERE contact_phone=${phone}`, callback);
	},
	add_new_contact: function(req, res, crypto_code, callback){
		console.log("model function for add_new_contact");
		console.log(req.body);
		console.log(req.session.data.id);
		console.log(req.session.data);
		var doq = `INSERT INTO contacts (contact_first_name, contact_last_name, contact_email, contact_phone, contact_relationship, contact_status, created_at, updated_at, users_id, crypto_code) VALUES ("${req.body.contact_first_name}", "${req.body.contact_last_name}", "${req.body.contact_email}", "${req.body.contact_phone}", "${req.body.contact_relationship}", 0, NOW(), NOW(), ${req.session.data.id}, ${crypto_code})`;
		doQuery(doq, callback);
		console.log(doq);
	},
	edit_profile: function(req, res, callback){
		var first_name = (req.body.first_name)?`first_name="${req.body.first_name}", `:"";
		var last_name = (req.body.last_name)?`last_name="${req.body.last_name}", `:"";
		var email = (req.body.email)?`email="${req.body.email}", `:"";
		var phone = (req.body.phone)?`phone="${req.body.phone}", `:"";
		var password = (req.body.password)?`password="${req.body.password}", `:"";
		var doq = `UPDATE users SET ${first_name}${last_name}${email}${phone}${password}updated_at=NOW() WHERE id=${req.session.data.id}`;
		console.log(doq);
		doQuery(doq, callback);
	},
	retrieve_password: function(req, res, callback){
		console.log(req.body, "retrieve_password in the model");
		var doQ = `SELECT id FROM users WHERE email = "${req.body.email}"`
		console.log(doQ);
		doQuery(doQ, callback);
	},

	change_pw: function(req, res, callback){
		console.log(req.body.email, "change_pw from model");
		console.log(req.body.email_code, "is the crypto packed correctly?");
		console.log(req.body, "the whole req.body from change_pw in model");
		var doQ = `UPDATE users SET password = "${req.body.email_code}" WHERE email = "${req.body.email}"`;
		console.log(doQ);
		doQuery(doQ, callback);
	},

	remove_declined_contacts: function(req, res, callback){
		var doq = `DELETE FROM contacts WHERE contact_status=2`;
		doQuery(doq, callback);
	}
}
