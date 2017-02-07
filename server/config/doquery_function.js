var connection = require('../config/mysql.js');

module.exports = function doQuery(query, callback)
{
    try
    {
        connection.query(query, function(err, rows, fields){
            callback(err, rows, fields);
            console.log(err, rows, fields, "rows from doquery function");
        });
    }
    catch (e)
    {
        callback(e, rows, fields);
        console.log(e);
        console.log("---");
        console.log(query);
    }
}
