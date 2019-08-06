 //npm init => npm i express ejs body-parsernpm --save
var express = require("express"),
	  index = express(),
 bodyparser = require("body-parser"),
 mongoose   = require("mongoose"),
Campground  = require("./models/campground"),
Comment     = require("./models/comment"),
//User        = require("./models/user");
 seeddb     = require("./seeds");

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
index.set("view engine","ejs");//para poder visualizar files.ejs
index.use(bodyparser.urlencoded({extended:true}));//se hara uso del paquete bodyparser
index.use(express.static(__dirname + "/public"));
seeddb();


//primer metodo
/*Campground.create({
	name:"mexico",
	image:"https://cdn.pixabay.com/photo/2016/01/26/23/32/camp-1163419__340.jpg",
	description: "a huge and beautiful granite hill, the best place for vacation"
},function(err,campground){
	if(err){
		console.log(err);
	}else{
		console.log("newly created campground");
		console.log(campground);
	}	
});*/

//INDEX
index.get("/",function(req,res){
	res.render("landing");
});
//CREATE
index.get("/campgrounds",function(req,res){
	//get all campgrounds from db
	Campground.find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/campgrounds",{campgrounds:allcampgrounds});//pasamos la lista de objetos
		}
	});
	//res.render("campgrounds",{campgrounds:campgrounds});//pasamos la lista de objetos
});
//POST
index.post("/campgrounds",function(req,res){
	var name  = req.body.name;
	var image = req.body.image;
	var desc  = req.body.description;
	var newcampground = {name:name, image:image, description:desc};//ojo la asignacion de las variables debe coincidir con las constantes del schema
	//create a new campground and save to db
	Campground.create(newcampground, function(err,newlycreated){
		if(err){
			console.log("there´s an error");	
		}else{
			res.redirect("/campgrounds");			
		}
	});
});
//NEW
index.get("/campgrounds/new",function(req,res){
	res.render("campgrounds/new");
});

//SHOW	
index.get("/campgrounds/:id",function(req,res){
	//find the compground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
		if(err){
			console.log(err);
		   }else{
			res.render("campgrounds/shows",{campground:foundcampground});			   
		   }
	});
});
//===========================================================================
//coments routes
//============================================================================
index.get("/campgrounds/:id/comments/new", function(req,res){
	//find campground by id
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			res.render("comments/new",{campground:campground});			
		}
	});
});

index.post("/campgrounds/:id/comments", function(req,res){
	//lookup campground usingh id
	Campground.findById(req.params.id, function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

index.listen(3000, function(){
	console.log("the yelpcamp server has started");
});