 //npm init => npm i express ejs body-parsernpm --save
var express = require("express"),
	  index = express(),
 bodyparser = require("body-parser"),
 mongoose   = require("mongoose"),
passport    = require("passport"),
localstrategy = require("passport-local"),
Campground  = require("./models/campground"),
Comment     = require("./models/comment"),
user        = require("./models/user"),
 seeddb     = require("./seeds");

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
index.set("view engine","ejs");//para poder visualizar files.ejs
index.use(bodyparser.urlencoded({extended:true}));//se hara uso del paquete bodyparser
index.use(express.static(__dirname + "/public"));
seeddb();

//passport configuration
index.use(require("express-session")({
	secret: "once again",
	resave: false,
	saveUninitialized: false
}));
index.use(passport.initialize());
index.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

index.use(function(req,res,next){
	res.locals.currentuser = req.user;
	next();
});//nos permite acceder a currentuserr desde todas las rutas

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
index.get("/campgrounds/:id/comments/new", isloggedin, function(req,res){
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

//AUTH ROUTES
index.get("/register", function(req,res){
	res.render("register");
});
//handle sign up logic
index.post("/register", function(req,res){
	var newuser = new user({username: req.body.username});
	user.register(newuser, req.body.password, function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res, function(){
			res.redirect("/campgrounds");
		});
	});
});

//login
index.get("/login", function(req,res){
	res.render("login");
});
//handling login logic
index.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req,res){
});

index.get("/logout", function(req,res){
	req.logout();
	res.redirect("/campgrounds");
});
//middleware
function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

index.listen(3000, function(){
	console.log("the yelpcamp server has started");
});