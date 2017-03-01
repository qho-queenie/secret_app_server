var models = require("./../models/model_template.js");

module.exports = function(){
	var day = new Date().getDay();
	var hours = new Date().getUTCHours();
	console.log(day);
	console.log(hour);

	if(day == 0 && hour == 0){
		console.log("time to cleanup declined contacts");
		models.model_template.remove_declined_contacts(undefined, undefined, function(err, rows){
			console.log(`result of cleanup: ${rows}`);
		})
	}
}