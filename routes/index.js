var express=require("express"),
router	   =express.Router();
var passport=require("passport");
var User=require("../models/user");
// HOME
router.get("/",function(req,res){
	res.render("home");
})
// AUTH ROUTES
// SHOW REGISTER FORM 
router.get("/register",function(req,res){
	res.render("register");
});
// REGISTER USER
router.post("/register",function(req,res){
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.redirect("/register");
		}else{
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome to YelpCamp "+ user.username);
				res.redirect("/grounds");
			})
		}
	})
});
// LOGIN FORM
router.get("/login",function(req,res){
	res.render("login");
});
// LOGGING IN
router.post("/login",passport.authenticate(
	"local",{
			successRedirect:"/grounds",
			failureRedirect:"/login"
			}
	),function(req,res){});
// LOGOUT ROUTE
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out!!")
	res.redirect("/grounds");
});

module.exports=router;