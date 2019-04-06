var express        	 =require("express"),
app       			 =express(),
bodyParser 			 =require("body-parser"),
mongoose   			 =require("mongoose"),
User				 =require("./models/user"),
Ground 				 =require("./models/ground"),
Comment 			 =require("./models/comment"),
seedDB			     =require("./seeds"),
passport		  	 =require("passport"),
passportLocal		 =require("passport-local"),
methodOverride		 =require("method-override"),
flash 				 =require("connect-flash");

var groundRoutes=require("./routes/grounds"),
commentRoutes	=require("./routes/comments"),
indexRoutes		=require("./routes/index");
// mongodb+srv://rajat:<password>@cluster0-ovlmg.mongodb.net/test?retryWrites=true

mongoose.connect("mongodb+srv://rajat:rajat@cluster0-ovlmg.mongodb.net/test?retryWrites=true");
// mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

// seedDB();

app.use(flash());
// PASSPORT CONFIG
app.use(require("express-session")({
	secret:"Jai hind",
	resave:false,
	saveUniniatialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Access current user from each template 
app.use(function(req,res,next){
	res.locals.user=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})

app.use(indexRoutes);
app.use(groundRoutes);
app.use(commentRoutes);


// app.listen(process.env.PORT,function(){
// 	console.log("SERVER STARTED!!");
// })
app.listen(3000,function(){
	console.log("SERVER STARTED!!");
})