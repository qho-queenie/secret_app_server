var models = require("./../models/model_template.js");

module.exports = function(debug){
	var day = new Date().getDay();
	var hours = new Date().getUTCHours();
	console.log(day);
	console.log(hours);

	if((day == 0 && hour == 0) || debug === true){
		console.log("time to cleanup declined contacts");
		models.remove_declined_contacts(undefined, undefined, function(err, rows){
			console.log(`result of cleanup: ${rows}`);
		})
	}
}