var express=require("express");
	router=express.Router();
	Campground=require("../models/campgrounds.js");
	Comment=require("../models/comments.js");
	user=require("../models/users.js")

router.get("/campgrounds/:id/comments/new",isloggedin,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}else{
			res.render("newcomm",{campground:campground});
		}
	});
});

router.delete("/campgrounds/:id/comments/:comment_id",checkcommentownership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err,comm){
		if(err){
			console.log(err);
		}else{ 
            res.redirect("/campgrounds/"+req.params.id);
		}
	})
})


router.post("/campgrounds/:id/comments",isloggedin,function(req,res){
			Campground.findById(req.params.id,function(err,campgrounds){
				if(err){
					console.log(err);
					res.redirect("/campgrounds");
				}else{
					Comment.create(req.body.comment,function(err,comm){
						if(err){
							console.log(err)
						}else{
						//add user 
						comm.author.id=req.user._id;
						comm.author.username=req.user.username;
						comm.save();
						console.log(comm);
						console.log("the comment's issuer is: "+ req.user.username);
						console.log(comm.author.id);
						campgrounds.comment.push(comm);
						campgrounds.save();
						res.redirect("/campgrounds/"+campgrounds._id);
					}
					})
				}
			})
});


function checkcommentownership(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,function(err, foundcomment){
			if(err){
				res.redirect("back");
			}else{
				if(foundcomment.author.id.equals(req.user._id))
				{next();
				}
				else{
					res.redirect("back");
				}
			}
	})
}
	else{
		res.redirect("back");
	}
}

function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports=router;