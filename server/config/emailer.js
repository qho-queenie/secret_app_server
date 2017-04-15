let nodemailer = require('nodemailer');
let path = require("path");
let p = require(path.join(__dirname, "./keys/emailPw.js"));
let transporter = nodemailer.createTransport(`smtps://noreply.usafe%40gmail.com:${p}@smtp.gmail.com`);
module.exports = transporter;
