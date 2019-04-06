var Ground=require("../models/ground"),
Comment   =require("../models/comment");
var middlewareOb={};
	middlewareOb.groundOwner = function(req,res,next){
		if(req.isAuthenticated()){
			Ground.findById(req.params.id,function(err,ground){
				if(err){
					console.log(err);
					res.redirect("/grounds/:id");
				}
				else{
					if(ground.author.id.equals(req.user._id)){
						next();
					}
					else{	
					 req.flash("error","Access denied!!");
					 res.redirect("back");
					 }
				}
			})
		}
		else{
					res.redirect("back");
		}	
	}

	middlewareOb.commentOwner = function(req,res,next){
		if(req.isAuthenticated()){
			Comment.findById(req.params.commentId,function(err,comment){
				if(err){
					console.log(err);
					res.redirect("back");
				}
				else{
					if(comment.author.id.equals(req.user._id)){
						next();
					}
					else{		
					 req.flash("error","Access denied!!");		
					 res.redirect("back");
					 }
				}
			})
		}
		else{
					res.redirect("back");
		}	
	}                                                                                                                                                     

	middlewareOb.isLoggedIn = function(req,res,next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash("error","You need to login first!!");
		res.redirect("/login");
	}


module.exports=middlewareOb;