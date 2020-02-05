var express=require("express");
    app=express();
    bodyParser=require("body-parser");
    passport=require("passport");
    passportstrategy=require("passport-local")
    mongoose=require("mongoose");
    Campground=require("./models/campgrounds");
    Comment=require("./models/comments");
    user=require("./models/users");
    metover=require("method-override");
    seedDB=require("./seeds.js")
    commentroute=require("./routes/commentroute.js");
    campgroundroutes=require("./routes/campgroundroute.js");
    authentication_rootroute=require("./routes/authentication_rootroute.js");


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//seedDB();
mongoose.connect("mongodb://localhost/yelpdb");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(metover("_method"));


app.use(require("express-session")({
	secret:"KITTU",
	resave:false,
	saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req,res,next){
	res.locals.current=req.user;
	next();
})

app.use(authentication_rootroute);
app.use(campgroundroutes);
app.use(commentroute);

app.listen(3000,function(){
  	console.log("Yelpcamp has started");	
})