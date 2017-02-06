var fs = require("fs");
var path = require("path");

module.exports = function(folder)
{
	var models = {};
	var modelPath = path.join(__dirname, "./../" + folder);
	fs.readdirSync(modelPath).forEach(function(file) {
	  if(file.indexOf('.js') >= 0) {
	    models[file.slice(0, (file.length - 3))] = require(path.join(modelPath, file));
	  }
	});
	return models;
}
