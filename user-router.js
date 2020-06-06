const mongoose = require("mongoose");
const ObjectId= require('mongoose').Types.ObjectId
const User = require("./UserModel");
const Trade = require("./TradeModel");
const express = require('express');
let router = express.Router();
let loginID;
router.get("/:uid", sendSingleUser);
router.get("/",loaduserDatabase);
router.post("/adduser",addfriend);
router.post("/accept",accept);
router.post("/reject",reject);
router.post("/tradetofriends",tradetofriends);
router.post("/trade",trade);

//Load a user based on uid parameter
router.param("uid", function(req, res, next, value){
	let oid;
	console.log("Finding user by ID: " + value);
	try{
		oid = new ObjectId(value);
	}catch(err){
		res.status(404).send("User ID " + value + " does not exist.");
		return;
	}
	
	User.findById(value, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading user.");
			return;
		}
		
		if(!result){
			res.status(404).send("User ID " + value + " does not exist.");
			return;
		}
		
		req.user = result;
		
		if(req.session.loggedin && req.session.username === req.user.name){
			req.user.ownprofile = true;
		}
		next();
	});
});

function auth(req, res, next) {
	if(!req.session.loggedin){
		res.status(401).send("Unauthorized");
		return;
	}
	
	next();
};

//Send the representation of a single user that is a property of the request object
//Sends either JSON or HTML, depending on Accepts header
function sendSingleUser(req, res, next){
	if(req.session.loggedin && req.session.username === req.user.name){
		loginID = req.user._id;
		res.format({
			"text/html": () => {res.render("user",  
			{username: req.user.name,
			 cards:req.user.cards,
			 friends:req.user.friends,
			 pending:req.user.pendingfriends,
			 trade:req.user.trade} )},
			"application/json": () => {res.status(200).json(res.users)}
		});
	}else{
		res.format({
			"text/html": () => {res.render("otherusers",  {username: req.user.name, cards:req.user.cards} )},
			"application/json": () => {res.status(200).json(res.users)}
		});
	}
	return
	next();
}

//function to search user
function loaduserDatabase(req, res, next){
	User.find()
	.where("name").regex(new RegExp(".*" + req.query.name + ".*", "i"))
	.limit(10)
	.exec(function(err, results){
		if(err){
			res.status(500).send("Error reading user.");
			console.log(err);
			return;
		}
		console.log("Found " + results.length + " matching user.");
		
		const rest = {
			users: results.map(result => {
			  return {
				name: result.name,
				_id: result._id
			  }
			})
		  }
		let currentsearchusers = rest.users;
		currentsearchusers.forEach(function(item, index, array) {
			if(item.name === req.session.username){
				currentsearchusers.splice(index,1)
			}
		})
		res.render("search",  {users:currentsearchusers});
		//res.status(200).send({users:res.users})
		return;
	})
}

//function to add friends
function addfriend(req,res){
	let userId = req.body.id;
	let currentuser = req.session.username;

	User.findById(userId,function(err, result){
		let adduser = result;
		addPendingUserHelper(adduser,currentuser)
	})
	res.redirect('/users')
}

//helper for addfriend function
function addPendingUserHelper(adduser,currentuser){
	let newpendingfriends = adduser.pendingfriends;
	newpendingfriends.push(currentuser);
	let myquery = { _id: adduser._id};
	var newvalues = { $set: {pendingfriends:newpendingfriends} };
	User.updateOne(myquery, newvalues,function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading user.");
			return;
		}
		
		if(!result){
			res.status(404).send("User ID " + value + " does not exist.");
			return;
		}
		// res.status(200).redirect('/:uid');
	});
}

//function to accept add friend request
function accept(req,res){
	let currentuser = req.session.username;
	User.findOne({name: currentuser},function(err, result){
		let frinedslist = result.friends;
		frinedslist.push(req.body.name);
		let pendingfriendslist = result.pendingfriends.filter(u=>{u !== req.body.name})
		acceptHelper(frinedslist,pendingfriendslist,currentuser);
	})
	User.findOne({name: req.body.name},function(err, result){
		let frinedslist = result.friends;
		frinedslist.push(currentuser);
		let pendingfriendslist = result.pendingfriends.filter(u=>{u !== req.body.name})
		acceptHelper(frinedslist,pendingfriendslist,req.body.name);
		res.send("ACEEPT USER!!!");
	})
}

//function to reject add friend request
function reject(req,res){
	let currentuser = req.session.username;
	User.findOne({name: currentuser},function(err, result){
		let pendingfriendslist = result.pendingfriends.filter(u=>{u !== req.body.name})
		rejectHelper(pendingfriendslist,currentuser);
		res.send("reject USER!!!");
	})
}

//helper for accept function
function acceptHelper(frinedslist,pendingfriendslist, name){
	let myquery = { name: name};
	var newvalues = { $set: {friends:frinedslist, pendingfriends:pendingfriendslist} };
	User.updateOne(myquery, newvalues,function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error accept user.");
			return;
		}
		
		if(!result){
			res.status(404).send("User ID does not exist.");
			return;
		}
		return;

	});
}

//helper for reject function
function rejectHelper(pendingfriendslist, name){
	let myquery = { name: name};
	var newvalues = { $set: {pendingfriends:pendingfriendslist} };
	User.updateOne(myquery, newvalues,function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error accept user.");
			return;
		}
		
		if(!result){
			res.status(404).send("User ID does not exist.");
			return;
		}
		return;

	});
}

//function for trading
//after clicking the friend's name on the dropdown menu
//this function redirect you to the trade page
function tradetofriends(req,res){
	let tradeUsername = req.body.select
	User.findOne({name: tradeUsername},function(err, result1){
		User.findOne({name: req.session.username},function(err, result2){
			res.render("trade",  {trader1:result2.name,cards:result2.cards,trader2:result1.name, othercards:result1.cards} )
		})
	})
}

//function for trading
//for selecting cards and clicking trade button
function trade(req,res){
	console.log(req.body);
	Trade.find({trader1:req.body.trader1,trader2:req.body.trader2})
    .exec()
    .then(trade => {
		if (trade.length >= 1) {
			return res.status(409).json({
			  message: "trade exists"
			});
		  } else {
			let newtrade = new Trade();
			newtrade.trader1name = req.body.trader1name
			newtrade.trader1 = req.body.trader1
			newtrade.trader2name = req.body.trader2name
			newtrade.trader2 = req.body.trader2
	
			mongoose.connect("mongodb://localhost:27017/a5", {useNewUrlParser: true});
			db = mongoose.connection;
			db.collection("trade").insert(newtrade, function(err, res) {
				if (err) throw err;
				let tarde = {
					_id:res.ops[0]._id,
					name:res.ops[0].trader1name
				}
				tradeHelper(tarde,res.ops[0].trader2name);
			  });
		  }
	});
	res.send('send trade to' + req.body.trader2name )
}

//helper function for trade method
function tradeHelper(trade, name){
	let myquery = { name: name};
	var newvalues = { $set: {trade:trade} };
	User.updateOne(myquery, newvalues,function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error accept user.");
			return;
		}
		
		if(!result){
			res.status(404).send("User ID does not exist.");
			return;
		}
		return;

	});
}

//Export the router object, so it can be mounted in the store-server.js file
module.exports = router;