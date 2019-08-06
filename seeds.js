var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
	{
		name: "mexico",
		image: "https://cdn.pixabay.com/photo/2014/11/27/18/36/tent-548022__340.jpg",
		description: "bla bla bla ncjklnsdcvkldsnklsklcnlnsdcnlsdcsd"
	},
	{
		name: "queretaro",
		image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
		description: ""
	},
	{
		name: "san luis",
		image: "https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__340.jpg",
		description: "very good place"
	}
];


function seeddb(){
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}
		console.log("removed");
		//add a few campgrounds
			data.forEach(function(seed){
				Campground.create(seed, function(err,campground){
					if(err){
						console.log(err);
					}else{
						console.log("added a campground");
						//create a comment
						Comment.create(
							{
								text: "this place is great, but i wish there was internet",
								author: "homer"
							}, function(err, comment){
								if(err){
								   	console.log(err);
								   }else{
									 campground.comments.push(comment);//pasamos el argumento sin parentesis
									 campground.save();	
									 console.log("created new comment");
								   }
							}
						);
					}
				});
			});
	});
	//add a few comments
}
module.exports = seeddb;