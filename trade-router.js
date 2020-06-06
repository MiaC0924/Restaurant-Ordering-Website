const mongoose = require('mongoose').set('debug', true)
const ObjectId= require('mongoose').Types.ObjectId
const Trade = require("./TradeModel");
const express = require('express');
let router = express.Router();

router.get("/:id", sendSingleCard);

router.param("id", function(req, res, next, value){
	let oid;
	console.log("Finding Trade by ID: " + value);
	try{
		oid = new ObjectId(value);
	}catch(err){
		res.status(404).send("--------- " + value + " does not exist.");
		return;
	}
	// Trade.find({},function(err,res){
	// 	console.log(res);
	// })
	Trade.findById(value, function(err, result){
		console.log(result);
		if(err){
			console.log(err);
			res.status(500).send("Error reading Trade.");
			return;
		}
		
		if(!result){
			res.status(404).send("Trade ID " + value + " does not exist.");
			return;
		}
		req.trade = result;
        console.log(result);
        res.render("peddingtrade",
         {  user1: result.trader1name, 
            card1:result.trader1,
            user2:result.trader2name,
            card2:result.trader2,
        });
	});
});
function sendSingleCard(req, res, next){
    //res.render("card", {card: req});
	// res.format({
	// 	"application/json": function(){
	// 		res.status(200).json(req.user);
	// 	},
	// 	"text/html": () => { res.render("user", {user: req.user}); }
	// });
	//res.status(200).json(req.user);
	next();
}


module.exports = router;