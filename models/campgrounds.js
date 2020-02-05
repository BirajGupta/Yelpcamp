var mongoose=require("mongoose");
	express=require("express");

var campgroundSchema= new mongoose.Schema({
	phone:Number,
	name:String,
	image:String,
	description:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"user"
		},
		username:String
	},
	comment:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"comment"
	}]
});

module.exports=mongoose.model("campground",campgroundSchema);

