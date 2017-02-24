var path = require("path");
var htmlPath = path.join(__dirname, "./../../client/");
var requireFolder = require("./../config/req_folder.js");
var models = requireFolder("models");
var fs = require("fs");
var crypto = require("crypto");
var nodemailer = require("../config/emailer.js");
var safeEval = require('safe-eval');
var flowroute = require(path.join(__dirname, './../flowroute-messaging-nodejs-master/flowroutemessaginglib'));
	flowroute.configuration.username = "95004144";
	flowroute.configuration.password = "ca2d914d75da2b78953b98c13473c718";

var sessionPendingMsgs = {};

var hardcodedPhoneNumber = "";

exps = {
	test: function(req, res){
		console.log(req.sessionID, "controller function called successfully");
			res.send("successfully made it through route->controller->model->response");
	},

	remove_declined_contacts: function(req, res){
		console.log("contact cleanup request ip address: " + req.connection.remoteAddress);
		if(req.connection.remoteAddress == "::1"){
			models.model_template.remove_declined_contacts(req, res, function(){
				if(!err)
					res.sendStatus(200);
				else
					res.sendStatus(500);
			})
		}
		else{
			console.log("Tried to run cleanup contacts but the wrong IP requested it");
			res.sendStatus(500);
		}
	},

	start_task: function(req, res){
		console.log("task:", req.body);
		console.log(req.body.minutes);
		sessionPendingMsgs[req.sessionID] = true;
		exps.start_task_sms(req.body);
		setTimeout(function(){
			console.log("Countdown done");
			if(sessionPendingMsgs[req.sessionID]){
				exps.alert_contact_sms(req.body);
			}
		}, parseInt(req.body.minutes) * 60000);
		res.sendStatus(200);
	},
	display_events: function(req, res){
		models.model_template.display_events(req, res, function(err, rows, fields){
			console.log(rows)
			res.json({data:rows});
		});
	},
	end_current_task: function(req, res){
		sessionPendingMsgs[req.sessionID] = undefined;
		res.sendStatus(200);
	},

	start_task_sms: function(data){
    	//Create and send a message
    	var phone = data.contact_phone;
    	if(!phone)
    		phone = hardcodedPhoneNumber;
			console.log(data, "is the data passed correctly?");
		flowroute.MessagesController.createMessage({"to": phone, "from": "14089122921", "content": `${data.user_first_name} is starting task ${data.event_name}. You will be alerted again if they don't check in after ${data.minutes} minutes. ${data.user_first_name} also said that ${data.additional_message}`}, function(err, response){
		      if(err){
		        console.log(err);
		      }
		      console.log(response);
    	});
	},

	add_contact_sms: function(data){
    	//Create and send a message
    	var phone = data.contact_phone;
			var sms_crypto = crypto.randomBytes(3).toString("hex").toLowerCase();
			console.log(sms_crypto, "sms_crypto");
			console.log(data.contact_phone, "contact number from data.contact_phone phone var")
    	if(!phone)
    		phone = hardcodedPhoneNumber;
		flowroute.MessagesController.createMessage({"to": phone, "from": "14089122921", "content": `${data.user_first_name} wants you to be an emergency contact for uSafe?. Reply "YES" with ${sms_crypto} if you wish to be their emergency contact. Reply "NO" if you do not wish to do so. Anytime you don't want to be the emergency contact, reply with "I am out."`}, function(err, response){
		      if(err){
		        console.log(err);
		      }
		      console.log(response);
    	});
	},
	sms_reply: function(req, res){
  		console.log(req.body, "sms_reply from controller")
 			models.model_template.find_contact_by_phone(req.body.from, function(err, rows, fields){
				console.log("sss")
				console.log(rows, "ssss");
				console.log(req.body);
				console.log(sms_crypto, "is the sms_crypto is here?")

				if (rows[0].contact_status == 0){
	 				if (req.body.body.toUpperCase().includes("YES") && req.body.body.toUpperCase().includes(`${sms_crypto}`)){
						console.log("yes and crypto passed");
	 					models.model_template.change_contact_status(1, rows[0].id, function(){});
	 				}
	 				else if (req.body.body.toUpperCase().includes("NO")){
						console.log("yes and crypto did not passed");
	 					models.model_template.change_contact_status(2, rows[0].id, function(){});
	 				}
				}
					else if (rows[0].contact_status == 1 && (req.body.body.toUpperCase().includes("I AM OUT") || req.body.body.toUpperCase().includes("IM OUT") || req.body.body.toUpperCase().includes("I\'M OUT"))){
					models.model_template.change_contact_status(2, rows[0].id, function(){});
				}
 				else {
 					console.log("person didnt correctly. Not doing anything.")
 				}
 			})
 			res.sendStatus(200);
  	},

	alert_contact_sms: function(data){
    	//Create and send a message
    	var phone = data.contact_phone;
    	if(!phone)
    		phone = hardcodedPhoneNumber;
		flowroute.MessagesController.createMessage({"to": phone, "from": "14089122921", "content": `${data.user_first_name} has not checked in after the specified time. Please contact your friend and make sure they are ok.`}, function(err, response){
		      if(err){
		        console.log(err);
		      }
		      console.log(response);
    	});
	},

	incoming_sms: function(req, res){
		console.log(`Incoming sms: ${req.body}`);
		res.sendStatus(200);
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

		var valid = true;
		var validation_errors = [];

		for(let field of ["first_name", "last_name", "email", "password", "confirm_password", "phone"]){
			if(req.body[field].length < 1){
				validationError(`${field} should not be empty.`);
			}
		}

		if(req.body.password !== req.body.confirm_password)
		{
			validationError("password and confirm password must match.");
		}

		if(req.body.password.length < 8)
		{
			validationError("password and confirm password must match.");
		}

		if(valid)
		{
			models.model_template.registration(req, res, function(err, rows, fields){
				// console.log(req.body, "res.data from registration");
				console.log(rows);
				// res.json({id: rows.insertId});
				res.json(rows.insertId);
			});
		}

		function validationError(errMsg){
			console.log(`validation error: ${errMsg}`);
			valid = false;
			validation_errors.push(errMsg);
		}
	},

	login: function(req, res){
		models.model_template.login(req, res, function(err, rows, fields){
			console.log("AKJHDFKJSDFG", req.body);
			req.session.data = {};
			if (rows.length > 0){
				req.session.data.id = rows[0].id;
				console.log(req.session, "session");
				res.json({success: true});
			}
			else{
				res.json({success: false, validation_errors: ["Invalid Login"]});
			}
		});
	},

	add_new_event: function(req, res){

		if(req.body.event_name.length > 0){
			models.model_template.add_new_event(req, res, function(err, rows, fields){
			console.log(rows, "add_new_event from controllers")
			res.json(rows);
			})
		}
		else{
			res.json({validation_error: "Task name cannot be empty."});
		}
	},

	add_new_contact: function(req, res){
        var valid = true;
		var validation_errors = [];

		for(let field of ["contact_first_name", "contact_last_name", "contact_email", "contact_relationship", "contact_phone"]){
			if(req.body[field].length < 1){
				validation_errors.push(`${field} cannot be empty.`)
				valid = false;
			}
		}
        console.log(req.body);
        if(valid){
            models.model_template.add_new_contact(req, res, function(err, rows, fields){
            	exps.add_contact_sms(req.body);
            	console.log(rows, "add_new_contact from controllers")
            	res.json({success: true, data: rows});
            });
        }
		else
        {
            console.log("validation failed");
            res.json({success: false, validation_errors: validation_errors});
        }
    },


	display_contacts: function(req, res){
		models.model_template.display_contacts(req, res, function(err, rows, fields){
			console.log(rows, "rows from display_contacts in controller")
			res.json({data:rows});
		});
	},

	display_user: function(req, res){
		models.model_template.display_user(req, res, function(err, rows, fields){
			res.json({data:rows});
		});
	},

	delete_event: function(req, res){
		models.model_template.delete_event(req, res, function(err, rows, fields){
			res.json(rows);
		})
	},
	delete_contact: function(req, res){
		models.model_template.delete_contact(req, res, function(err, rows, fields){
			res.json(rows);
		})
	},
	edit_profile: function(req, res){
		models.model_template.edit_profile(req, res, function(err, rows, fields){
			res.json(rows);
		})
	},
	retrieve_password: function(req, res){
		console.log(req.body, "retrieve_password in the controller");
		models.model_template.retrieve_password(req, res, function( err, rows, fields){
		console.log(rows.length, "rows from retrieve_password controller");
		if (rows.length === 0){
			res.json({success: false, validation_errors: ["We can't find your record. Try again or register?"]});
		}
		else{
			console.log("loop for found");
			let email_crypto = crypto.randomBytes(5).toString("hex");

			req.body.email_code = email_crypto;
			req.body.domain = "54.193.124.182/";

			var content = safeEval("`" + fs.readFileSync(__dirname + "/email.html", "utf8") + "`", req.body);
			var mailOptions = {
					from: '"USafe? Password" <noreply.usafe@gmail.com>', // sender address
					to: req.body.email, // list of receivers
					subject: "USafe? Account Info", // Subject line
					text: '', // plaintext body
					html: content// html body
			};
			nodemailer.sendMail(mailOptions, function(error, info){
					if(error){
							return console.log(error);
					}
					else{
						res.json({success: false, validation_errors: ["Please check your email."]});
					}
				});

			models.model_template.change_pw(req, res, function(err, rows, fields){

			})
//change password + send email
		}
		})
	}
}
module.exports = exps;
