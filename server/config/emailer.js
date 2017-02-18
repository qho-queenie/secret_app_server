var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://noreply.usafe%40gmail.com:usafefornow1@smtp.gmail.com');

// setup e-mail data with unicode symbols


// send mail with defined transport object
module.exports = transporter;
