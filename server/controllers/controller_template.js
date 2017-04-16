var path = require("path");
var htmlPath = path.join(__dirname, "./../../client/");
var requireFolder = require("./../config/req_folder.js");
var models = requireFolder("models");
var fs = require("fs");
var crypto = require("crypto");
var nodemailer = require("../config/emailer.js");
var safeEval = require('safe-eval');
var shortid = require('shortid');
var flowroute = require("../config/keys/flowroute.js");

var sessionPendingMsgs = {};

var user_timers = {};

var hardcodedPhoneNumber = "";

var current_tasks_phone = {};

var contact_availability = {};

var msg_cooldowns = {availability: {}, tasks: {}, contact_requests: {}, requests_per_phone_number: {}};

//constants for statically delayed things, mostly limits on spamming.
const one_minute = 60000;
const five_minutes = 300000;
const ten_minutes = 600000;
const thirty_minutes = 1800000;
const one_hour = 3600000;
const one_day = 86400000;

//helper for pulling out code in sms_reply
function pullOutCode(message, toRemove){
	var searchMask = toRemove;
	var regEx = new RegExp(searchMask, "ig");
	var replaceMask = "";

	return message.replace(regEx, replaceMask).trim();
}

function fixPhoneNumber(phoneNum){
	let result = "";
	let success = false;
	for(let i = 0; i < phoneNum.length; i++){
		let asciiCode = phoneNum.charCodeAt(i);
		if(asciiCode > 47 && asciiCode < 58){
			result += phoneNum[i];
		}
	}
	if(result.length === 10){
		result = `1${result}`;
	}
	if(result.length === 11){
		success = true;
	}

	return {success: success, phoneNum: result};
}

function validateUserData(req, allowEmpty = false){
	let valid = true;
	let validation_errors = [];
	let letters = /^[A-Za-z]+$/;
	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	let phoneData = fixPhoneNumber(req.body.phone);

	if(!allowEmpty){
		for(let field of ["first_name", "last_name", "email", "password", "confirm_password", "phone"]){
			if(req.body[field].length < 1){
				validationError(`${field.replace("_", " ")} should not be empty.`);
			}
		}
	}

	if(checkField(req.body.password !== req.body.confirm_password)){
		validationError("Password and confirm password must match.");
	}
	if(checkField(re.test(req.body.email) == false)){
		validationError("Invalid email");
	}
	if(checkField(req.body.password.length < 8)){
		validationError("Password should be at least 8 characters.");
	}
	if(checkField(!phoneData.success)){
		validationError(`Phone number ${phoneData.phoneNum} is not valid.`);
	}
	return {success: valid, validation_errors: validation_errors};

	function checkField(condition){
		return (allowEmpty && field.length < 1) || condition;
	}

	function validationError(errMsg){
		console.log(`validation error: ${errMsg}`);
		valid = false;
		validation_errors.push(errMsg);
	}
}

exps = {
	test: function(req, res){
		console.log(req.sessionID, "controller function called successfully");
			res.send("successfully made it through route->controller->model->response");
	},

	check_contact_availability: function(req, res){
		var avail = (contact_availability[req.query.id] === true);
		var cooldown = msg_cooldowns.availability[req.query.id];
		console.log(contact_availability);
		if(!avail && !cooldown)
		{
			msg_cooldowns.availability[req.query.id] = true;
			setTimeout(function(){msg_cooldowns.availability[req.query.id] = false;}, ten_minutes);

			console.log(req.query.id);
			models.model_template.get_contact_avail_info(req.query.id, function(err, rows, fields){
				console.log("results from get_contact_avail_info:", rows);
				var phone = rows[0].contact_phone;
				var crypto_code = rows[0].crypto_code;
				var user_first_name = rows[0].first_name;
				flowroute.MessagesController.createMessage({"to": phone, "from": "14089122921", "content": `${rows[0]["first_name"]} wants to know if you are available to be their emergency contact for an upcoming task. Reply with "I'm down" and ${crypto_code} to let them know you have their back. No action is needed if you aren't available.`}, function(err, response){
					console.log(response);
				})
			});

		}
		res.json({availability: avail, spam_cooldown: cooldown});
	},

	get_all_available_contacts: function(req, res){
		var result = [];
		models.model_template.display_contacts(req, res, function(err, rows, fields){
			console.log("all contacts before availability check:", rows);
			for(let contact of rows)
			{
				console.log("contact status, id:", contact.contact_status, contact.id);
				console.log(contact_availability);
				if(contact.contact_status == 1 && contact_availability[contact.id])
				{
					result.push(contact);
				}
			}
			res.json(result);
		});
	},

	remove_declined_contacts: function(req, res){
		console.log("contact cleanup request ip address: " + req.connection.remoteAddress);
		if(req.connection.remoteAddress == "::ffff:127.0.0.1"){
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

		var cooldown = true;
		if(req.session.data){
			cooldown = msg_cooldowns.tasks[req.session.data.id];
			console.log(cooldown);

			if(!cooldown){
				msg_cooldowns.tasks[req.session.data.id] = true;
				setTimeout(function(){msg_cooldowns.tasks[req.session.data.id] = false;}, five_minutes);

				console.log("task:", req.body);
				console.log(req.body.minutes);
				sessionPendingMsgs[req.session.data.id] = true;
				exps.start_task_sms(req.body);
				console.log(req.body.contact_phone, "req.body.phone in start_task controller");
				current_tasks_phone[req.session.data.id] = req.body.contact_phone;
				var ms = parseInt(req.body.minutes) * 60000;
				user_timers[req.session.data.id] = {timeLimitSeconds: ~~(ms/1000), startTime: process.hrtime()};
				setTimeout(function(){
					console.log("Countdown done");
					user_timers[req.session.data.id] = undefined;
					if(sessionPendingMsgs[req.session.data.id]){
						exps.alert_contact_sms(req.body);
					}
				}, ms);
			}
		}

		res.json({spam_cooldown: cooldown});
	},

	get_current_timer(req, res){

		if(req.session.data){
			var timer = user_timers[req.session.data.id];
			if(timer){
				var timeElapsed = process.hrtime(timer.startTime)[0];
				console.log(timeElapsed)
				var timeRemaining = ~~(timer.timeLimitSeconds - timeElapsed);
				res.json({timeRemaining: timeRemaining});
			}
			else{
				res.json({});
			}
		}
		else{
			res.json({});
		}
	},

	display_events: function(req, res){
		models.model_template.display_events(req, res, function(err, rows, fields){

			if(rows.length > 0){
				res.json({data:rows});
			}
			else{
				models.model_template.display_user(req, res, function(err, rows, fields){
					res.json({data:rows});
				});
			}
		});
	},
	end_current_task: function(req, res){

		if(req.session.data && user_timers[req.session.data.id])
		{
			var phone = current_tasks_phone[req.session.data.id];
			user_timers[req.session.data.id] = undefined;
			console.log(current_tasks_phone, "current_tasks_phone at end_current_task controller")
			console.log(phone, "phone from end_current_task controller");
			models.model_template.display_user(req, res, function(err, rows, fields){
			console.log(rows, "rows from end_current_task controller");
					sessionPendingMsgs[req.session.data.id] = undefined;
					flowroute.MessagesController.createMessage({"to": phone, "from": "14089122921", "content": `${rows[0]["first_name"]} has checked in safely.`}, function(err, response){
						console.log(response);
				})
			})
		}
		res.sendStatus(200);
	},

	start_task_sms: function(data){
    	//Create and send a message
			// `${data.user_first_name} has not checked in after the specified time. Please contact your friend and make sure they are ok.`;
    	var phone = data.contact_phone;
    	if(!phone)
    		phone = hardcodedPhoneNumber;
			console.log(data, "is the data passed correctly?");

		flowroute.MessagesController.createMessage({"to": phone, "from": "14089122921", "content": `${data.user_first_name} is starting task ${data.event_name}. You will be alerted again if they don't check in after ${data.minutes} minutes. ${(data.additional_message !== "")? `${data.user_first_name} also said that ${data.additional_message}` : ""}`}, function(err, response){
		      if(err){
		        console.log(err);
						// res.json({success: false, validation_errors: ["Something went wrong. Please try again."]});
		      }
					console.log(response);
		      // res.json({success: true, validation_errors: []});
    	});
	},

	add_contact_sms: function(req, crypto_code){
    	//Create and send a message

		if(req.session.data){
    	var data = req.body;
			console.log(data, "checking data at add_contact_sms");
    	var phone = data.contact_phone;

			console.log(data.contact_phone, "contact number from data.contact_phone phone var");

    	if(!phone)
    		phone = hardcodedPhoneNumber;
		flowroute.MessagesController.createMessage({"to": phone, "from": "14089122921", "content": `${data.user_first_name} wants you to be an emergency contact on uSafe?. Reply "YES" with ${crypto_code} if you wish to be their emergency contact. No action is needed if you do not wish so.`}, function(err, response){
		      if(err){
		        console.log(err);
		      }
		      console.log("response from the createMessage");
    	});
		}else{
			console.log("Can't add contact without session.");
		}

	},
	sms_reply: function(req, res){

		setTimeout(function(){
	  		console.log(req.body, "sms_reply from controller");
			var status = 0;
			var expectedStatus = 0;
			var changeStatus = false;
			var crypto_code;
			var availability_response = false;
			if (req.body.body.toUpperCase().includes("YES")){
				console.log("there is a yes in include");
				status = 1;
				expectedStatus = 0;
				crypto_code = pullOutCode(req.body.body, "yes");
				changeStatus = true;
			}
			else if (req.body.body.toUpperCase().includes("I AM OUT") || req.body.body.toUpperCase().includes("IM OUT") || req.body.body.toUpperCase().includes("I\'M OUT")){
				console.log("im out");
				status = 2;
				expectedStatus = 1;
				crypto_code = pullOutCode(req.body.body, "im out");
				crypto_code = pullOutCode(crypto_code, "i'm out");
				crypto_code = pullOutCode(crypto_code, "i am out");
				changeStatus = true;
			}
			else if (req.body.body.toUpperCase().includes("IM DOWN") || req.body.body.toUpperCase().includes("I'M DOWN") || req.body.body.toUpperCase().includes("I AM DOWN")){
				console.log("im down");
				availability_response = true;
				crypto_code = pullOutCode(req.body.body, "im down");
				crypto_code = pullOutCode(crypto_code, "i'm down");
				crypto_code = pullOutCode(crypto_code, "i am down");
			}
			else{
				console.log("person didnt reply correctly. Not doing anything.");
				flowroute.MessagesController.createMessage({"to": req.body.from, "from": "14089122921", "content":
				"We didn't recognize that message. You may have made a typo. Please try again."}, function(err, response){
					if(err){
						console.log(err);
					}
				});
			}

			if(changeStatus)
			{
				if (status === 1){
					models.model_template.find_user_by_crypto(crypto_code, function(err, rows, fields){
						console.log(rows, "find_user_by_crypto rows");
						if(rows[0]){
							flowroute.MessagesController.createMessage({"to": req.body.from, "from": "14089122921", "content":
							`You are now ${rows[0].first_name}'s emergency contact on USafe? Anytime you don't want to be the emergency contact anymore, reply "I'm out" with ${crypto_code}`}, function(err, response){
								if(err){
									console.log(err);
								}
								console.log("response from the status === 1 receipt");
							});
						}
						else
						{
							flowroute.MessagesController.createMessage({"to": req.body.from, "from": "14089122921", "content":
							"Say what? You entered the wrong code."}, function(err, response){
								if(err){
									console.log(err);
								}
							});
						}
					})
				}
				else if (status === 2){
					models.model_template.find_user_by_crypto(crypto_code, function(err, rows, fields){
						if(rows[0]){
							flowroute.MessagesController.createMessage({"to": req.body.from, "from": "14089122921", "content":
							`You are no longer ${rows[0].first_name}'s emergency contact on USafe?`}, function(err, response){
									if(err){
										console.log(err);
									}
									console.log("response from the status === 2 receipt");
							});
						}
						else
						{
							flowroute.MessagesController.createMessage({"to": req.body.from, "from": "14089122921", "content":
							"Say what? You entered the wrong code."}, function(err, response){
									if(err){
										console.log(err);
									}
							});
						}
					})
				}
				models.model_template.change_contact_status(status, crypto_code, expectedStatus, function(err, rows, fields){
					console.log(rows, "rows");
					console.log(fields, "fields");
					console.log(err, "err");
				});
			}
			else if(availability_response === true)
			{	
				models.model_template.get_contact_avail_info_from_crypto(crypto_code, function(err, rows, fields){
					console.log(rows);
					if(rows && rows.length > 0)
					{
						var id = rows[0].id;
						contact_availability[id] = true;
						var duration = one_hour;
						setTimeout(function(){contact_availability[id] = undefined;}, duration);
					}
				})
			}

			res.sendStatus(200);
		}, 2000);
 	},

	alert_contact_sms: function(data){
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

		// let valid = true;
		// let validation_errors = [];
		// let letters = /^[A-Za-z]+$/;
		// let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		// let phoneData = fixPhoneNumber(req.body.phone);

		// for(let field of ["first_name", "last_name", "email", "password", "confirm_password", "phone"]){
		// 	if(req.body[field].length < 1){
		// 		validationError(`${field.replace("_", " ")} should not be empty.`);
		// 	}
		// }

		// if(req.body.password !== req.body.confirm_password)
		// {
		// 	validationError("Password and confirm password must match.");
		// }
		// if(re.test(req.body.email) == false)
		// {
		// 	validationError("Invalid email");
		// }
		// if(req.body.password.length < 8)
		// {
		// 	validationError("Password should be at least 8 characters.");
		// }
		// if(!phoneData.success)
		// {
		// 	validationError(`Phone number ${phoneData.phoneNum} is not valid.`);
		// }
		const validation = validateUserData(req);

		if(validation.success)
		{
			models.model_template.registration(req, res, function(err, rows, fields){
				// console.log(req.body, "res.data from registration");
				if (rows === undefined || rows.insertId === undefined){
					res.json({success: false, validation_errors: ["Email has been taken already. Nice try."]});
				}
				else if (rows.insertId){
					req.session.data = {};
					req.session.data.id = rows.insertId;
					res.json({success: true, data: rows.insertId});
				}
				else{
					res.json({success: false, validation_errors: ["registration failed for an unknown reason. Please try again."]});
				}

			});
		}
		else{
			res.json(validation);
		}

		// function validationError(errMsg){
		// 	console.log(`validation error: ${errMsg}`);
		// 	valid = false;
		// 	validation_errors.push(errMsg);
		// }
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
			res.json({success: true, data: rows});
			})
		}
		else{
			res.json({success: false, validation_errors: ["Task name field cannot be empty"]});
		}
	},

	add_new_contact: function(req, res){
        var valid = true;
		var validation_errors = [];

		for(let field of ["contact_first_name", "contact_last_name", "contact_email", "contact_relationship", "contact_phone"]){
			if(req.body[field].length < 1){
				validation_errors.push(`${field.replace("_", " ")} cannot be empty.`);
				valid = false;
			}
		}
        console.log(req.body);

        if(msg_cooldowns.contact_requests[req.session.data.id] > 4){
        	validation_errors.push("You are sending contact requests too rapidly. You can send up to 5 requests per 10 minutes.");
        	valid = false;
        }
        else{
        	if(typeof msg_cooldowns.contact_requests[req.session.data.id] !== "number"){
        		msg_cooldowns.contact_requests[req.session.data.id] = 1;
        	}
        	else{
				msg_cooldowns.contact_requests[req.session.data.id]++;
        	}

        	setTimeout(function(){
        		msg_cooldowns.contact_requests[req.session.data.id]--;
        	}, ten_minutes);
        }

        if(msg_cooldowns.requests_per_phone_number[req.body.contact_phone] > 4){
        	validation_errors.push("There are too many requests to this person right now. Please try again later.");
        	valid = false;
        }
        else{
        	if(typeof msg_cooldowns.requests_per_phone_number[req.body.contact_phone] !== "number"){
        		msg_cooldowns.requests_per_phone_number[req.body.contact_phone] = 1;
        	}
        	else{
				msg_cooldowns.requests_per_phone_number[req.body.contact_phone]++;
        	}

        	setTimeout(function(){
        		msg_cooldowns.requests_per_phone_number[req.body.contact_phone]--;
        	}, one_day);
        }

        //initial validations passed
        if(valid){
        	//this one was not unique, so using shortid now.
		// var crypto_code = crypto.randomBytes(3).toString("hex");
		var crypto_code = shortid.generate();
		console.log(crypto_code, "crypto code");

		models.model_template.find_contact_by_phone(req.body.contact_phone, req.session.data.id, function(err, rows, fields){

			if(rows.length < 1){
				models.model_template.add_new_contact(req, res, crypto_code, function(err, rows, fields){
					exps.add_contact_sms(req, crypto_code);
					res.json({success: true, validation_errors:[]});
				});
        	}
        	else{
        		if(rows[0].contact_status == 0){
        			res.json({success: false, validation_errors: ["You already have a pending contact request to that person."]});
        		}
        		else if(rows[0].contact_status == 1)
        		{
        			res.json({success: false, validation_errors: ["You have already added that person as an emergency contact."]});
        		}
        		else if(rows[0].contact_status == 2)
        		{
        			res.json({success: false, validation_errors: ["That person has recently rejected your request. There is a cleanup every week of rejected contacts after which time you can try again."]});
        		}
        	}

		})

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

		const validation = validateUserData(req, true);

		if(validation.success)
		{
			models.model_template.edit_profile(req, res, function(err, rows, fields){
				res.json(rows);
			});
		}
		else{
			//res.json(validation);
			res.json([]);
		}
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
