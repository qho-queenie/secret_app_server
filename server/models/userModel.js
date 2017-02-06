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
  getauser: function(req, res, callback){
    console.log("model function called successfully");
    //you can make a query by calling your callback, which you write in the controller.
    doQuery(`select * from users where users.id = ${req.session.data.userid}`, callback);
  },
  update_user_info: function(req, res, callback){
    var test = `update users set email="${req.body.email}", first_name="${req.body.first_name}", last_name="${req.body.last_name}", phone="${req.body.phone}", position="${req.body.position}", company="${req.body.company}", street="${req.body.street}", city="${req.body.city}", state="${req.body.state}", zipcode="${req.body.zipcode}" where users.id ="${req.session.data.userid}"`;
    console.log(test);
    doQuery(test, callback);
  }
}
