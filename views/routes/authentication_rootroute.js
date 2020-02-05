var express=require("express");
	router=express.Router();
	passport=require("passport");
	passportstrategy=require("passport-local");
	user=require("../models/users.js");

	
router.get("/",function(req,res){
	res.render("landing");
})

router.get("/register",function(req,res){
	res.render("register");
});


router.post("/register",function(req,res){
	user.register(new user({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
				res.redirect("/campgrounds");
		});
	});
});

router.get("/login",function(req,res){
	res.render("login");
})

router.post("/login",passport.authenticate("local",{successRedirect:"/campgrounds",failureRedirect:"/login"}),function(req,res){
});

router.get("/logout",isloggedin,function(req,res){
	req.logout();
	res.render("login");
})

function isloggedin(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports=router;


