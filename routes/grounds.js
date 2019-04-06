var express=require("express"),
router	   =express.Router();

var Ground 	   =require("../models/ground"),
middleware 	   =require("../middleware/index");


// INDEX ROUTE
router.get("/grounds",function(req,res){
	Ground.find({},function(err,all){
		if(err){
			req.flash("error",err.message);
			console.log(err);
		}
		else{
			res.render("grounds/index",{grounds:all})
		}
	})

})
// NEW ROUTE
router.get("/grounds/new",middleware.isLoggedIn,function(req,res){
	res.render("grounds/new");
});
// CREATE ROUTE
router.post("/grounds",middleware.isLoggedIn,function(req,res){
	var author={
		username:req.user.username,
		id:req.user._id
	}
	var ob={
		"name":req.body.name,
		"image":req.body.image,
		"description":req.body.description,
		"author":author,
		"price":req.body.price
	};
	Ground.create(ob,function(err,ground){
			if(err){
				req.flash("error",err.message);
			}
			else{
				req.flash("success","Successfully created campground!!");
				res.redirect("/grounds");
			}
		}
	)
})
//SHOW ROUTE
router.get("/grounds/:id",function(req,res){
	Ground.findById(req.params.id).populate("comments").exec(function(err,ground){
		if(err){
			req.flash("error",err.message);
		}
		else{
			res.render("grounds/show",{ground:ground});
		}
	})

});
// EDIT ROUTE
router.get("/grounds/:id/edit",middleware.groundOwner,function(req,res){
	Ground.findById(req.params.id,function(err,ground){
		if(err){
			req.flash("error",err.message);
			res.redirect("/grounds/:id");
		}else{
			res.render("../views/grounds/edit",{ground:ground});
		}
	})
});
// UPDATE ROUTE
router.put("/grounds/:id",middleware.groundOwner,function(req,res){
	Ground.findByIdAndUpdate(req.params.id,req.body.ground,function(err,ground){
		if(err){
			req.flash("error",err.message);
			res.redirect("/grounds/:id");
		}else{
			res.redirect("/grounds/"+req.params.id);
		}
	})
})
// DELETE
router.delete("/grounds/:id",middleware.groundOwner,function(req,res){
	Ground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			req.flash("error",err.message);
			res.redirect("/grounds/"+req.params.id);
		}else{
			req.flash("success","Successfully removed campground!!");
			res.redirect("/grounds");
		}
	})
})

module.exports=router;