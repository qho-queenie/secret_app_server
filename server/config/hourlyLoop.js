module.exports = function(){
	var day = new Date().getDay();
	var day = new Date().getUTCHours();
	console.log(day);
	console.log(hour);

	if(day == 0 && hour == 0){
		console.log("time to cleanup declined contacts");
	}
}