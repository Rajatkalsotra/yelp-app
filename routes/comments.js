var express=require("express"),
router	   =express.Router();

var Ground 	   =require("../models/ground"),
Comment   	   =require("../models/comment"),
middleware 	   =require("../middleware/index");;


// COMMENTS

// NEW ROUTE
router.get("/grounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
	Ground.findById(req.params.id,function(err,ground){
		if(err){
			req.flash("error",err.message);
			res.redirect("/grounds/"+ req.params.id);
		}
		else{
				res.render("comments/new",{ground:ground});
		}
	})
});
// CREATE
router.post("/grounds/:id/comments",middleware.isLoggedIn,function(req,res){
	Ground.findById(req.params.id,function(err,ground){
		if(err){
			req.flash("error",err.message);
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}
				else{
					comment.author.id=req.user._id;
					comment.author.username=req.user.username;
					comment.save();
					ground.comments.push(comment._id);
					ground.save();
					req.flash("success","Successfully created the comment!!");
					res.redirect("/grounds/"+ground._id);
				}
			})
		}
	})
});
// EDIT
router.get("/grounds/:id/comments/:commentId/edit",middleware.commentOwner,function(req,res){
	Comment.findById(req.params.commentId,function(err,comment){
		if(err){
			req.flash("error",err.message);
			res.redirect("/grounds/"+ req.params.id);
		}
		else{
				res.render("comments/edit",{comment:comment,groundId:req.params.id});
		}
	})
});
// UPDATE
router.put("/grounds/:id/comments/:commentId",middleware.commentOwner,function(req,res){
	Comment.findByIdAndUpdate(req.params.commentId,req.body.comment,function(err,comment){
		if(err){
			req.flash("error",err.message);
			res.redirect("/grounds/"+ req.params.id);
		}
		else{
			res.redirect("/grounds/"+ req.params.id);
		}
	})
});
// DELETE
router.delete("/grounds/:id/comments/:commentId",middleware.commentOwner,function(req,res){
	Comment.findByIdAndRemove(req.params.commentId,function(err){
			req.flash("success","Comment removed Successfully!!");
			res.redirect("/grounds/"+ req.params.id);	
	})
})


module.exports=router;