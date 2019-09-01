var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");

var userschema = new mongoose.Schema({
	username: String,
	password: String
});

userschema.plugin(passportlocalmongoose); //conectamos passport-mongoose a nuestro schema
module.exports = mongoose.model("user",userschema);