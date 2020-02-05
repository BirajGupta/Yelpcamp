var express=require("express");
	router=express.Router();
	Campground=require("../models/campgrounds.js");
	user=require("../models/users.js")

router.get("/campgrounds",function(req,res){
	Campground.find({},function(err,allcampgrounds){
		//console.log(req.user);
		if(err){
			console.log("there is an error");
		}else{
			res.render("campgrounds",{campgrounds:allcampgrounds,current:req.user});
		}
	})
})

router.post("/campgrounds",function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var newcampground={name:name,image:image,description:desc};
	Campground.create(newcampground,function(err,newlycreated){
		if(err){
			console.log(err);
		}else
		{	
			newlycreated.author.id=req.user._id;
			newlycreated.author.username=req.user.username;
			newlycreated.save();
			res.redirect("/campgrounds");
		}
	})
});

router.delete("/campgrounds/:id",checkcampgroundownership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}
			res.redirect("/campgrounds");
	})
})

router.get("/campgrounds/:id/edit",function(req,res){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err, foundcampground){
			if(err){
				console.log(err);
			}else{
				console.log(foundcampground.author.id);  
				if(foundcampground.author.id.equals(req.user._id)){
            			res.render("edit",{campground:foundcampground});
				}
				else{
					res.send("you do not have permission!!")
				}
			}
	})
}
	else{
		res.send("you must be logged in");
	}
})



router.put("/campgrounds/:id",checkcampgroundownership, function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updatedcampground){
		if(err){
			console.log(err);
		}
		res.redirect("/campgrounds/"+req.params.id);
	})
})



router.get("/campgrounds/new",isloggedin,function(req,res){
	res.render("new.ejs");
});
router.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comment").exec(function(err,foundcampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundcampground);
			res.render("show",{campground:foundcampground});
		}
		});
	});

function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


function checkcampgroundownership(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err, foundcampground){
			if(err){
				res.redirect("back");
			}else{
				if(foundcampground.author.id.equals(req.user._id))
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


module.exports=router;