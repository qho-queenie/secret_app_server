// var mongoose = require('mongoose');
//
// var fs = require('fs');

// This is where the connection to the database happens
// You would replace newDatabaseName with the name of your database
// mongoose.connect('mongodb://localhost/YPC');
/*
*  CONNECTION EVENTS
*  When successfully connected
*/
// mongoose.connection.on( 'connected', function () {
//   console.log( 'Mongoose default connection open to' );
// });
/*
*  If the connection throws an error
*/
// mongoose.connection.on( 'error', function ( err ) {
//   console.error( 'Mongoose default connection error:' + err );
// });
/*
*  When the connection is disconnected
*/
// mongoose.connection.on( 'disconnected', function () {
//   console.log( 'Mongoose default connection disconnected' );
// });

// This is a great little function that imports all of our
// models from the model directory, so if you change
// the folder structure you might have to update models_path
// var models_path = __dirname + "/../models"
//
// fs.readdirSync(models_path).forEach(function(file){
// 	if(file.indexOf('.js') > 0) {
// 		require(models_path + '/' + file);
// 	}
// })
