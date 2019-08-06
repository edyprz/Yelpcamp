var mongoose = require("mongoose");
//schema setup
var campgroundschema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});
//model
module.exports = mongoose.model("Campground",campgroundschema);