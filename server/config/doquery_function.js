var connection = require('../config/mysql.js');

module.exports = function doQuery(query, callback)
{
    try
    {
        connection.query(query, function(err, rows, fields){
            try{
                callback(err, rows, fields);
            }
            catch (e)
            {
                callback(e, rows, fields);
                console.log(e);
                console.log("---");
                console.log(query);
            }
        });
    }
    catch (e)
    {
        callback(e);
        console.log(e);
        console.log("---");
    }
}
