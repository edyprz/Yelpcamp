 //npm init => npm i express ejs body-parsernpm --save
var express = require("express"),
	  index = express(),
 bodyparser = require("body-parser"),
 mongoose   = require("mongoose"),
passport    = require("passport"),
localstrategy = require("passport-local"),
methodoverride = require("method-override"),
Campground  = require("./models/campground"),
Comment     = require("./models/comment"),
user        = require("./models/user"),
 seeddb     = require("./seeds");

var commentroutes = require("./routes/comments"),
	campgroundroutes = require("./routes/campground"),
	indexroutes = require("./routes/index");

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);
index.set("view engine","ejs");//para poder visualizar files.ejs
index.use(bodyparser.urlencoded({extended:true}));//se hara uso del paquete bodyparser
index.use(express.static(__dirname + "/public"));
index.use(methodoverride("_method"));
//seeddb();

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
index.use("/",indexroutes);
index.use("/campgrounds",campgroundroutes);
index.use("/campgrounds/:id/comments",commentroutes);



index.listen(3000, function(){
	console.log("the yelpcamp server has started");
});